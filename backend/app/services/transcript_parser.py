import json
import re
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field, field_validator


class ParsedSegment(BaseModel):
    speaker_name: str = "Unknown Speaker"
    start_time: int = 0
    end_time: int = 5
    content: str
    sequence_number: int = 1


class JSONSegmentInput(BaseModel):
    speaker: Optional[str] = None
    speaker_name: Optional[str] = None
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    content: Optional[str] = None
    text: Optional[str] = None
    sequence: Optional[int] = None
    sequence_number: Optional[int] = None

    def get_speaker(self) -> str:
        s = self.speaker or self.speaker_name
        return s.strip() if s and s.strip() else "Unknown Speaker"

    def get_content(self) -> str:
        c = self.content or self.text
        return c.strip() if c and c.strip() else ""


def parse_vtt_time(time_str: str) -> int:
    """
    Parse a VTT timestamp string like '00:01:23.456' or '01:23.456' into seconds (rounded integer).
    """
    time_str = time_str.strip()
    parts = time_str.split(":")
    if len(parts) == 3:
        h = float(parts[0])
        m = float(parts[1])
        s = float(parts[2])
        return max(0, int(round(h * 3600 + m * 60 + s)))
    elif len(parts) == 2:
        m = float(parts[0])
        s = float(parts[1])
        return max(0, int(round(m * 60 + s)))
    return 0


def parse_plain_text(text: str) -> List[ParsedSegment]:
    """
    Parse plain text or .txt content into structured transcript segments.
    Extracts speaker if in formats like 'Speaker Name: Content' or '[Speaker Name]: Content'.
    Generates realistic sequential timestamps.
    """
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    segments: List[ParsedSegment] = []

    current_time = 0
    seq = 1

    # Regex for Speaker: Content (e.g., 'Piyush Kumar Jha: Hello' or '[Piyush]: Hello')
    speaker_regex = re.compile(r"^(?:\[([a-zA-Z0-9\s._\-]+)\]|([a-zA-Z0-9\s._\-]+))\s*:\s*(.+)$")

    for line in lines:
        match = speaker_regex.match(line)
        if match:
            speaker = match.group(1) or match.group(2)
            content = match.group(3).strip()
            speaker = speaker.strip()
        else:
            speaker = "Unknown Speaker"
            content = line

        if not content:
            continue

        # Estimate duration based on word count (~3 words per second, min 4s, max 30s)
        word_count = len(content.split())
        duration = max(4, min(30, int(round(word_count / 2.5))))

        start = current_time
        end = start + duration
        current_time = end + 1

        segments.append(
            ParsedSegment(
                speaker_name=speaker if speaker else "Unknown Speaker",
                start_time=start,
                end_time=end,
                content=content,
                sequence_number=seq,
            )
        )
        seq += 1

    return segments


def parse_vtt(text: str) -> List[ParsedSegment]:
    """
    Parse WebVTT (.vtt) format content into structured transcript segments.
    Handles cue headers, timestamps '00:00:00.000 --> 00:00:05.000', and speaker cues (<v Speaker> or Speaker:).
    """
    lines = [line.rstrip() for line in text.splitlines()]
    segments: List[ParsedSegment] = []

    time_regex = re.compile(
        r"((?:\d{2}:)?\d{2}:\d{2}(?:\.\d{3})?)\s*-->\s*((?:\d{2}:)?\d{2}:\d{2}(?:\.\d{3})?)"
    )
    v_tag_regex = re.compile(r"<v(?: voice)?\s+([^>]+)>(.*)")
    speaker_prefix_regex = re.compile(r"^([a-zA-Z0-9\s._\-]+)\s*:\s*(.+)$")

    i = 0
    seq = 1
    total_lines = len(lines)

    while i < total_lines:
        line = lines[i].strip()
        if not line or line.startswith("WEBVTT") or line.startswith("NOTE"):
            i += 1
            continue

        time_match = time_regex.search(line)
        if time_match:
            start_str, end_str = time_match.group(1), time_match.group(2)
            start_sec = parse_vtt_time(start_str)
            end_sec = parse_vtt_time(end_str)
            if end_sec <= start_sec:
                end_sec = start_sec + 4

            # Read content lines until next blank line or timestamp
            i += 1
            content_lines = []
            while i < total_lines and lines[i].strip() and not time_regex.search(lines[i]):
                content_lines.append(lines[i].strip())
                i += 1

            raw_content = " ".join(content_lines).strip()
            if raw_content:
                # Check for voice tag <v Speaker>Content
                v_match = v_tag_regex.match(raw_content)
                if v_match:
                    speaker = v_match.group(1).strip()
                    content = v_match.group(2).replace("</v>", "").strip()
                else:
                    spk_match = speaker_prefix_regex.match(raw_content)
                    if spk_match:
                        speaker = spk_match.group(1).strip()
                        content = spk_match.group(2).strip()
                    else:
                        speaker = "Unknown Speaker"
                        content = raw_content

                if content:
                    segments.append(
                        ParsedSegment(
                            speaker_name=speaker if speaker else "Unknown Speaker",
                            start_time=start_sec,
                            end_time=end_sec,
                            content=content,
                            sequence_number=seq,
                        )
                    )
                    seq += 1
            continue
        i += 1

    # Fallback to plain text if no VTT timestamps were matched
    if not segments and text.strip():
        return parse_plain_text(text)

    return segments


def parse_json_transcript(json_data: Any) -> List[ParsedSegment]:
    """
    Parse structured JSON transcript array into validated ParsedSegment objects.
    """
    if isinstance(json_data, str):
        try:
            json_data = json.loads(json_data)
        except Exception as e:
            raise ValueError(f"Invalid JSON format: {str(e)}")

    if isinstance(json_data, dict):
        if "segments" in json_data and isinstance(json_data["segments"], list):
            items = json_data["segments"]
        elif "transcript" in json_data and isinstance(json_data["transcript"], list):
            items = json_data["transcript"]
        else:
            items = [json_data]
    elif isinstance(json_data, list):
        items = json_data
    else:
        raise ValueError("JSON transcript must be an array of segments or object with 'segments'")

    if not items:
        raise ValueError("Transcript JSON contains no segments.")

    segments: List[ParsedSegment] = []
    current_time = 0

    for idx, item in enumerate(items, 1):
        if not isinstance(item, dict):
            continue

        raw = JSONSegmentInput(**item)
        content = raw.get_content()
        if not content:
            continue

        speaker = raw.get_speaker()

        # Handle timestamps
        if raw.start_time is not None and raw.end_time is not None:
            start = int(round(raw.start_time))
            end = int(round(raw.end_time))
            if end <= start:
                end = start + max(3, len(content.split()) // 3)
            current_time = end + 1
        else:
            word_count = len(content.split())
            duration = max(4, min(30, int(round(word_count / 2.5))))
            start = current_time
            end = start + duration
            current_time = end + 1

        seq = raw.sequence_number or raw.sequence or idx

        segments.append(
            ParsedSegment(
                speaker_name=speaker,
                start_time=start,
                end_time=end,
                content=content,
                sequence_number=seq,
            )
        )

    # Sort and re-sequence sequentially
    segments.sort(key=lambda s: (s.start_time, s.sequence_number))
    for i, s in enumerate(segments, 1):
        s.sequence_number = i

    return segments
