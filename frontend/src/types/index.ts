// TypeScript Interfaces matching FastAPI backend schemas exactly

export interface User {
  id: number;
  display_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface Participant {
  id: number;
  meeting_id: number;
  name: string;
  email?: string | null;
  role?: string | null;
}

export interface ParticipantInput {
  name: string;
  email?: string;
  role?: string;
}

export interface MeetingSummary {
  id: number;
  meeting_id: number;
  overview: string;
  created_at: string;
  updated_at: string;
}

export interface KeyTopic {
  id: number;
  meeting_id: number;
  title: string;
  description?: string | null;
  sequence_number: number;
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker_name: string;
  start_time: number;
  end_time: number;
  content: string;
  sequence_number: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  task: string;
  assignee?: string | null;
  is_completed: boolean;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  meeting_title?: string | null;
  meeting_code?: string | null;
  meeting_date?: string | null;
}

export interface ActionItemCreate {
  meeting_id: number;
  task: string;
  assignee?: string;
  is_completed?: boolean;
  due_date?: string;
}

export interface ActionItemUpdate {
  task?: string;
  assignee?: string | null;
  is_completed?: boolean;
  due_date?: string | null;
}

export interface Meeting {
  id: number;
  meeting_code: string;
  title: string;
  workspace?: string | null;
  description?: string | null;
  meeting_date: string;
  duration_seconds: number;
  participant_count: number;
  action_item_count?: number;
  processing_status?: string;
  summary_preview?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetingDetail {
  id: number;
  meeting_code: string;
  title: string;
  workspace?: string | null;
  description?: string | null;
  audio_path?: string | null;
  processing_status?: string;
  meeting_date: string;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
  owner_id: number;
  owner?: User | null;
  participants: Participant[];
  summary?: MeetingSummary | null;
  key_topics: KeyTopic[];
  action_items: ActionItem[];
}

export interface MeetingCreate {
  title: string;
  workspace?: string;
  description?: string;
  meeting_date?: string;
  duration_seconds?: number;
  owner_id?: number;
  meeting_code?: string;
  participants?: ParticipantInput[];
}

export interface MeetingUpdate {
  title?: string;
  workspace?: string;
  description?: string;
  meeting_date?: string;
  duration_seconds?: number;
  meeting_code?: string;
  processing_status?: string;
  participants?: ParticipantInput[];
}

export interface TranscriptImportRequest {
  text?: string;
  raw_text?: string;
  format?: string;
  segments?: Array<{
    speaker?: string;
    speaker_name?: string;
    start_time?: number;
    end_time?: number;
    content?: string;
    text?: string;
    sequence?: number;
    sequence_number?: number;
  }>;
}

export interface TranscriptImportResponse {
  meeting_id: number;
  total_segments: number;
  duration_seconds: number;
  processing_status: string;
  segments: TranscriptSegment[];
  message: string;
}

export interface ApiError {
  detail: string;
}
