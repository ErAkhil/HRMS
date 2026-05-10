"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onSchedule: () => void;
}

export function ScheduleMeetingModal({ onClose, onSchedule }: Readonly<Props>) {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("30 min");
  const [meetingPlatform, setMeetingPlatform] = useState("Zoom");
  const [meetingParticipants, setMeetingParticipants] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");

  function handleSubmit() {
    setMeetingTitle(""); setMeetingDate(""); setMeetingTime("");
    setMeetingDuration("30 min"); setMeetingPlatform("Zoom");
    setMeetingParticipants(""); setMeetingAgenda("");
    onSchedule();
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel w-full max-w-lg p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Schedule Meeting</h2>
          <button onClick={onClose} className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-field">Meeting Title <span className="text-rose-dark">*</span></label>
            <input type="text" placeholder="e.g. Team Sync, 1:1 with Sarah..." value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Date <span className="text-rose-dark">*</span></label>
              <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Time <span className="text-rose-dark">*</span></label>
              <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Duration</label>
              <select value={meetingDuration} onChange={(e) => setMeetingDuration(e.target.value)} className="input-field">
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>1 hour</option>
                <option>1.5 hours</option>
                <option>2 hours</option>
              </select>
            </div>
            <div>
              <label className="label-field">Platform</label>
              <select value={meetingPlatform} onChange={(e) => setMeetingPlatform(e.target.value)} className="input-field">
                <option>Zoom</option>
                <option>Google Meet</option>
                <option>Microsoft Teams</option>
                <option>In-person</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Participants</label>
            <input type="text" placeholder="Add team members..." value={meetingParticipants} onChange={(e) => setMeetingParticipants(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Agenda <span className="font-normal text-muted">(optional)</span></label>
            <textarea rows={2} placeholder="What will be discussed?" value={meetingAgenda} onChange={(e) => setMeetingAgenda(e.target.value)} className="input-field resize-none" />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Schedule Meeting</button>
        </div>
      </div>
    </div>
  );
}
