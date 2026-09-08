import {
  ActionItem,
  ActionItemCreate,
  ActionItemUpdate,
  Meeting,
  MeetingCreate,
  MeetingDetail,
  MeetingSummary,
  MeetingUpdate,
  TranscriptImportRequest,
  TranscriptImportResponse,
  TranscriptSegment,
  User,
} from "@/types";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

class ApiServiceError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiServiceError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic request wrapper with robust error handling and typed parsing.
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const isFormData = options?.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string>),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = `Request failed with status ${response.status}`;
      let errorData: unknown = null;
      try {
        errorData = await response.json();
        if (errorData && typeof errorData === "object" && "detail" in errorData) {
          errorDetail = (errorData as { detail: string }).detail;
        }
      } catch {
        // Non-JSON response payload
      }
      throw new ApiServiceError(errorDetail, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiServiceError) {
      throw error;
    }
    // Network or connection failure
    throw new ApiServiceError(
      "Unable to connect to MeetScribe API. Please ensure the backend server is running.",
      0,
      error
    );
  }
}

// ----------------------------------------------------
// Typed API Endpoints
// ----------------------------------------------------

/**
 * Fetch all meetings with optional search, sort, and workspace filters.
 * GET /api/meetings?search=...&sort=...&workspace=...
 */
export async function getMeetings(
  search?: string,
  sort?: string,
  workspace?: string
): Promise<Meeting[]> {
  const params = new URLSearchParams();
  if (search && search.trim()) params.append("search", search.trim());
  if (sort && sort.trim()) params.append("sort", sort.trim());
  if (workspace && workspace.trim() && workspace.trim() !== "All Workspaces") {
    params.append("workspace", workspace.trim());
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<Meeting[]>(`/api/meetings${queryString}`);
}

/**
 * Fetch complete meeting details including owner, participants, summary, topics, and actions.
 * GET /api/meetings/{id}
 */
export async function getMeeting(meetingId: number): Promise<MeetingDetail> {
  return apiRequest<MeetingDetail>(`/api/meetings/${meetingId}`);
}

/**
 * Fetch transcript segments for a meeting, ordered chronologically, with optional search filter.
 * GET /api/meetings/{id}/transcript or GET /api/meetings/{id}/transcript?search=...
 */
export async function getTranscript(
  meetingId: number,
  search?: string
): Promise<TranscriptSegment[]> {
  const query = search ? `?search=${encodeURIComponent(search.trim())}` : "";
  return apiRequest<TranscriptSegment[]>(`/api/meetings/${meetingId}/transcript${query}`);
}

/**
 * Import pasted transcript text or structured JSON payload.
 * POST /api/meetings/{id}/transcript
 */
export async function importMeetingTranscript(
  meetingId: number,
  payload: TranscriptImportRequest
): Promise<TranscriptImportResponse> {
  return apiRequest<TranscriptImportResponse>(`/api/meetings/${meetingId}/transcript`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Upload a transcript file (.txt, .vtt, .json) for processing and segment storage.
 * POST /api/meetings/{id}/transcript/upload
 */
export async function uploadMeetingTranscriptFile(
  meetingId: number,
  file: File
): Promise<TranscriptImportResponse> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  return apiRequest<TranscriptImportResponse>(`/api/meetings/${meetingId}/transcript/upload`, {
    method: "POST",
    body: formData,
  });
}

/**
 * Fetch meeting 1-to-1 summary.
 * GET /api/meetings/{id}/summary
 */
export async function getMeetingSummary(meetingId: number): Promise<MeetingSummary> {
  return apiRequest<MeetingSummary>(`/api/meetings/${meetingId}/summary`);
}

/**
 * Fetch all action items for a meeting.
 * GET /api/meetings/{id}/action-items
 */
export async function getMeetingActionItems(meetingId: number): Promise<ActionItem[]> {
  return apiRequest<ActionItem[]>(`/api/meetings/${meetingId}/action-items`);
}

/**
 * Fetch all action items across all meetings in the workspace.
 * GET /api/action-items?search=...&is_completed=...&assignee=...
 */
export async function getAllActionItems(params?: {
  search?: string;
  is_completed?: boolean;
  assignee?: string;
  meeting_id?: number;
}): Promise<ActionItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.search && params.search.trim()) queryParams.append("search", params.search.trim());
  if (params?.is_completed !== undefined) queryParams.append("is_completed", String(params.is_completed));
  if (params?.assignee && params.assignee !== "All Assignees") queryParams.append("assignee", params.assignee.trim());
  if (params?.meeting_id) queryParams.append("meeting_id", String(params.meeting_id));

  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return apiRequest<ActionItem[]>(`/api/action-items${query}`);
}

/**
 * Create a new meeting.
 * POST /api/meetings
 */
export async function createMeeting(data: MeetingCreate): Promise<MeetingDetail> {
  return apiRequest<MeetingDetail>("/api/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Upload audio file for a meeting.
 * POST /api/meetings/{id}/audio
 */
export async function uploadMeetingAudio(
  meetingId: number,
  audioBlobOrFile: Blob | File,
  filename = "recording.webm"
): Promise<MeetingDetail> {
  const formData = new FormData();
  formData.append("file", audioBlobOrFile, filename);

  return apiRequest<MeetingDetail>(`/api/meetings/${meetingId}/audio`, {
    method: "POST",
    body: formData,
  });
}

/**
 * Create a new action item associated with a meeting.
 * POST /api/action-items
 */
export async function createActionItem(
  data: ActionItemCreate
): Promise<ActionItem> {
  return apiRequest<ActionItem>("/api/action-items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an action item (e.g. toggle completion, edit task, change assignee).
 * PATCH /api/action-items/{id}
 */
export async function updateActionItem(
  actionItemId: number,
  data: ActionItemUpdate
): Promise<ActionItem> {
  return apiRequest<ActionItem>(`/api/action-items/${actionItemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete an action item.
 * DELETE /api/action-items/{id}
 */
export async function deleteActionItem(
  actionItemId: number
): Promise<{ status: string; message: string }> {
  return apiRequest<{ status: string; message: string }>(`/api/action-items/${actionItemId}`, {
    method: "DELETE",
  });
}

/**
 * Partially update a meeting.
 * PATCH /api/meetings/{id}
 */
export async function updateMeeting(
  meetingId: number,
  data: MeetingUpdate
): Promise<MeetingDetail> {
  return apiRequest<MeetingDetail>(`/api/meetings/${meetingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a meeting and cascade dependent records.
 * DELETE /api/meetings/{id}
 */
export async function deleteMeeting(
  meetingId: number
): Promise<{ status: string; message: string }> {
  return apiRequest<{ status: string; message: string }>(`/api/meetings/${meetingId}`, {
    method: "DELETE",
  });
}

/**
 * Fetch all registered users in the workspace.
 * GET /api/users
 */
export async function getUsers(): Promise<User[]> {
  return apiRequest<User[]>("/api/users");
}

/**
 * Fetch user by ID.
 * GET /api/users/{id}
 */
export async function getUser(userId: number): Promise<User> {
  return apiRequest<User>(`/api/users/${userId}`);
}

/**
 * Trigger AI transcript analysis to generate Executive Summary, Key Topics, and Action Items.
 * POST /api/meetings/{id}/generate-summary
 */
export async function generateMeetingAiInsights(meetingId: number): Promise<MeetingDetail> {
  return apiRequest<MeetingDetail>(`/api/meetings/${meetingId}/generate-summary`, {
    method: "POST",
  });
}


