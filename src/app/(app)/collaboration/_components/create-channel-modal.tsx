"use client";

import { useState } from "react";

interface Props {
  onCreate: (name: string) => Promise<void>;
  onClose: () => void;
}

export function CreateChannelModal({ onCreate, onClose }: Readonly<Props>) {
  const [name, setName] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    await onCreate(name.trim());
    setName("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
        <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Create Channel</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">Channel Name</label>
            <input
              type="text"
              placeholder="e.g. engineering, announcements"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-3 bg-gray-2 px-3 py-2 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-3 px-4 py-2.5 text-sm font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!name.trim()} className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
