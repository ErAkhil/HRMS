"use client";

import { useState } from "react";

interface Props {
  onStart: (name: string, platform: string) => void;
  onClose: () => void;
}

export function StartMeetingModal({ onStart, onClose }: Readonly<Props>) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("Zoom");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
        <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Start Meeting</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Meeting Name</label>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Platform</label>
            <select
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value)}
              className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            >
              <option>Zoom</option>
              <option>Google Meet</option>
              <option>Microsoft Teams</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
            Cancel
          </button>
          <button
            onClick={() => onStart(meetingName, meetingPlatform)}
            className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}
