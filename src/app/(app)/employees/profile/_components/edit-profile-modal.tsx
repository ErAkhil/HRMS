interface Props {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: Readonly<Props>) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
        <h2 className="mb-5 text-lg font-semibold text-dark dark:text-white">Edit Profile</h2>
        <div className="space-y-4">
          {[
            { label: "Full Name", defaultValue: "Sarah Mitchell", type: "text" },
            { label: "Phone", defaultValue: "+91 98765 43210", type: "tel" },
            { label: "Email", defaultValue: "sarah.mitchell@acme.com", type: "email" },
            { label: "Location", defaultValue: "Bengaluru, Karnataka", type: "text" },
          ].map(({ label, defaultValue, type }) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{label}</label>
              <input
                type={type}
                defaultValue={defaultValue}
                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark focus:border-primary-600 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:focus:border-primary-600"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-gray-3 bg-white px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">Cancel</button>
          <button onClick={onClose} className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
