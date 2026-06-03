"use client";

import { useRef, useState } from "react";
import { uploadDocument } from "@/lib/actions/documents";

interface DocumentUploadProps {
  readonly contextId: string;
  readonly contextType: "task" | "channel" | "project";
  readonly onSuccess?: (fileName: string) => void;
}

export function DocumentUpload({
  contextId,
  contextType,
  onSuccess,
}: Readonly<DocumentUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        const result = await uploadDocument(file, contextId, contextType);
        setUploadedFiles((prev) => [...prev, result.name]);
        onSuccess?.(result.name);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.txt"
        disabled={isUploading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {isUploading ? "Uploading..." : "Upload Document"}
      </button>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-dark dark:text-white">
            Uploaded ({uploadedFiles.length}):
          </p>
          <ul className="space-y-1">
            {uploadedFiles.map((fileName) => (
              <li
                key={fileName}
                className="flex items-center gap-2 text-sm text-dark-5 dark:text-dark-6"
              >
                <svg
                  className="h-4 w-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {fileName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
