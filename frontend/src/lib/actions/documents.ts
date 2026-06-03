"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export interface DocumentMetadata {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string;
}

export interface DocumentSharingSettings {
  readonly sharedWith?: string[];
  readonly isPublic?: boolean;
  readonly canDownload?: boolean;
  readonly canComment?: boolean;
  readonly expiresAt?: Date;
}

/**
 * Upload document to task or channel
 */
export async function uploadDocument(
  file: File,
  contextId: string,
  contextType: "task" | "channel" | "project",
): Promise<{
  readonly id: string;
  readonly url: string;
  readonly name: string;
}> {
  const user = await requireAuth();

  if (file.size > 50 * 1024 * 1024) {
    throw new Error("File too large (max 50MB)");
  }

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "text/plain",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not allowed");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contextId", contextId);
    formData.append("contextType", contextType);

    const response = await api.post<{
      readonly id: string;
      readonly url: string;
      readonly name: string;
    }>("/documents/upload", formData);

    return response;
  } catch (error) {
    throw new Error("Failed to upload document");
  }
}

/**
 * Share document with users
 */
export async function shareDocument(
  documentId: string,
  settings: DocumentSharingSettings,
): Promise<void> {
  const user = await requireAuth();

  try {
    await api.post(`/documents/${documentId}/share`, settings);
  } catch (error) {
    throw new Error("Failed to share document");
  }
}

/**
 * Get documents for context (task, channel, etc.)
 */
export async function getContextDocuments(
  contextId: string,
  contextType: "task" | "channel" | "project",
): Promise<DocumentMetadata[]> {
  const user = await requireAuth();

  try {
    return await api.get<DocumentMetadata[]>(
      `/documents?contextId=${contextId}&contextType=${contextType}`,
    );
  } catch (error) {
    throw new Error("Failed to fetch documents");
  }
}

/**
 * Delete document
 */
export async function deleteDocument(
  documentId: string,
  contextId: string,
  contextType: "task" | "channel" | "project",
): Promise<void> {
  const user = await requireAuth();

  try {
    await api.delete(`/documents/${documentId}`);
  } catch (error) {
    throw new Error("Failed to delete document");
  }
}
