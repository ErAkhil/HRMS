"use client";

import { useState } from "react";
import { addMeetingNote, getMeetingNotes } from "@/lib/actions/meetings";
import type React from "react";

interface MeetingNotesProps {
  readonly meetingId: string;
}

export function MeetingNotes({ meetingId }: Readonly<MeetingNotesProps>) {
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedNotes, setSavedNotes] = useState<
    Array<{ id: string; content: string; createdAt: string }>
  >([]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsLoading(true);
    try {
      const result = await addMeetingNote(meetingId, notes);
      setSavedNotes([
        ...savedNotes,
        {
          id: result.id,
          content: result.content,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNotes("");
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Note */}
      <form onSubmit={handleAddNote} className="space-y-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add meeting notes or action items..."
          rows={4}
          className="w-full rounded-lg border border-gray-3 bg-white px-4 py-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:focus:border-primary-600 dark:focus:ring-primary-900/30"
        />
        <button
          type="submit"
          disabled={isLoading || !notes.trim()}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Add Note"}
        </button>
      </form>

      {/* Saved Notes */}
      {savedNotes.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-dark dark:text-white">Notes ({savedNotes.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-gray-3 bg-white p-3 dark:border-dark-3 dark:bg-dark-2"
              >
                <p className="text-sm text-dark dark:text-white">{note.content}</p>
                <p className="mt-2 text-xs text-dark-5 dark:text-dark-6">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
