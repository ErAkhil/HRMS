"use client";

import { useState } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-dark-2 rounded-xl shadow-lg max-w-sm w-full mx-4 animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-gray-3 dark:border-dark-3">
          <h2 className="text-lg font-semibold text-dark dark:text-white">{title}</h2>
          {description && (
            <p className="text-sm text-dark-5 dark:text-dark-6 mt-1">{description}</p>
          )}
        </div>
        <div className="p-6 flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-3 dark:border-dark-3 text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 ${
              isDangerous
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
          >
            {isLoading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
