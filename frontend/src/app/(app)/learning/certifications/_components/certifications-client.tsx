"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type Cert = {
  id: string;
  name: string;
  issuer: string;
  credential: string | null;
  earnedAt: string;
  expiresAt: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isExpiringSoon(iso: string | null) {
  if (!iso) return false;
  const diff = new Date(iso).getTime() - Date.now();
  return diff > 0 && diff < 90 * 24 * 3600000;
}

function isExpired(iso: string | null) {
  if (!iso) return false;
  return new Date(iso).getTime() < Date.now();
}

export function CertificationsClient({ certifications }: Readonly<{ certifications: Cert[] }>) {
  const { toast, setToast } = useToast();

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Certifications</h1>
        <p className="text-muted mt-0.5">Your earned certifications · {certifications.length} total</p>
      </div>

      {certifications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
            <svg className="h-7 w-7 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-body-medium">No certifications yet</p>
            <p className="text-muted mt-1">Complete courses and earn your first certification.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => {
            const expired = isExpired(cert.expiresAt);
            const expiringSoon = isExpiringSoon(cert.expiresAt);
            const statusBadge = expired
              ? "bg-rose-light text-rose-dark dark:bg-rose-dark/20"
              : expiringSoon
              ? "bg-amber-light text-amber-dark"
              : "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald";
            const statusLabel = expired ? "Expired" : expiringSoon ? "Expiring Soon" : "Active";

            return (
              <div key={cert.id} className="card-p">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="text-body-medium mb-1 line-clamp-2">{cert.name}</p>
                <p className="text-muted mb-3 text-sm">{cert.issuer}</p>
                <div className="mb-3 space-y-1 text-sm text-muted">
                  <p>Earned: <span className="text-dark dark:text-white">{formatDate(cert.earnedAt)}</span></p>
                  <p>Expires: <span className="text-dark dark:text-white">{cert.expiresAt ? formatDate(cert.expiresAt) : "No expiry"}</span></p>
                  {cert.credential && (
                    <p className="truncate font-mono text-xs">{cert.credential}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    const html = `<!DOCTYPE html><html><head><title>Certificate – ${cert.name}</title>
<style>body{font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb}
.cert{border:6px double #4f46e5;padding:48px 56px;max-width:600px;text-align:center;background:white}
h1{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:#6366f1;margin:0 0 24px}
h2{font-size:28px;margin:0 0 8px;color:#111}
.issuer{color:#555;font-size:16px;margin:0 0 32px}
.credential{font-family:monospace;font-size:11px;color:#888;margin:24px 0 0}
.dates{display:flex;gap:32px;justify-content:center;margin:24px 0;font-size:13px;color:#555}
.seal{width:60px;height:60px;border-radius:50%;background:#eff6ff;border:2px solid #4f46e5;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px}
@media print{body{background:white}}</style></head><body>
<div class="cert">
<div class="seal">🏅</div>
<h1>Certificate of Achievement</h1>
<h2>${cert.name}</h2>
<p class="issuer">Issued by ${cert.issuer}</p>
<div class="dates">
<span>Earned: ${formatDate(cert.earnedAt)}</span>
${cert.expiresAt ? `<span>Expires: ${formatDate(cert.expiresAt)}</span>` : "<span>No expiry</span>"}
</div>
${cert.credential ? `<p class="credential">Credential ID: ${cert.credential}</p>` : ""}
</div>
<script>window.onload=()=>{window.print()}</script></body></html>`;
                    const w = window.open("", "_blank");
                    if (w) { w.document.write(html); w.document.close(); }
                  }}
                  className="btn-secondary w-full py-1.5 text-xs"
                >
                  Download Certificate
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
