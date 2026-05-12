import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Monja" };

const SECTIONS = [
  {
    title: "1. Information we collect",
    content: `We collect information you provide directly to us when creating an account, registering your organization, or using our services:

- **Account information**: Name, email address, password (hashed), organization name, and role.
- **Employee data**: Information entered by HR administrators, including employee names, contact details, employment details, payroll data, and attendance records.
- **Usage data**: Log data including IP address, browser type, pages visited, and actions taken within the platform.
- **Payment information**: Billing details for paid plans (processed via our payment provider; we do not store card numbers).`,
  },
  {
    title: "2. How we use your information",
    content: `We use the information we collect to:

- Provide, operate, and improve the Monja platform
- Process transactions and send billing-related communications
- Send service updates, security alerts, and administrative messages
- Respond to support requests and inquiries
- Analyze usage patterns to improve product features
- Comply with legal obligations

We do not sell your personal data to third parties. We do not use your employee data for advertising purposes.`,
  },
  {
    title: "3. Data storage and security",
    content: `All data is stored on Supabase (PostgreSQL) with strict row-level security policies ensuring each organization's data is completely isolated from others.

We implement industry-standard security measures including:
- Encryption in transit (TLS 1.3) and at rest (AES-256)
- Multi-factor authentication support
- Regular security audits and penetration testing
- Automated backups with 30-day retention
- Role-based access control within your organization`,
  },
  {
    title: "4. Data sharing",
    content: `We share your information only in limited circumstances:

- **Service providers**: We work with vendors (hosting, payment processing, email delivery) who access data only to perform services on our behalf.
- **Legal requirements**: We may disclose information if required by law, court order, or governmental authority.
- **Business transfers**: If Monja is acquired or merged, your data may be transferred as part of that transaction.
- **With your consent**: We may share information for any other purpose with your explicit consent.

We do not share employee personal data with third-party advertisers or data brokers.`,
  },
  {
    title: "5. Your rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:

- **Access**: Request a copy of the personal data we hold about you.
- **Correction**: Request that we correct inaccurate or incomplete data.
- **Deletion**: Request deletion of your personal data ("right to be forgotten").
- **Portability**: Request your data in a machine-readable format.
- **Objection**: Object to certain types of data processing.

To exercise these rights, contact us at privacy@monja.app. We will respond within 30 days.`,
  },
  {
    title: "6. Data retention",
    content: `We retain your data for as long as your account is active or as needed to provide services. When you close your account:

- Active account data is deleted within 30 days
- Backup copies are purged within 90 days
- Billing records are retained for 7 years as required by Indian tax law
- We may retain anonymized, aggregated data for analytics purposes indefinitely`,
  },
  {
    title: "7. Cookies",
    content: `We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze platform usage. See our Cookie Policy for full details. You can control cookies through your browser settings, though disabling them may affect platform functionality.`,
  },
  {
    title: "8. Children's privacy",
    content: `Monja is designed for business use and is not directed at children under 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: "9. Changes to this policy",
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email and display a notice within the platform at least 30 days before the changes take effect. Continued use of Monja after the effective date constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact us",
    content: `If you have questions about this Privacy Policy or your personal data, please contact:

**Monja Technologies**
Privacy Team
Email: privacy@monja.app
Address: Bangalore, Karnataka, India`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-slate-400">
            Last updated: <span className="text-slate-300">May 1, 2026</span>
          </p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Monja Technologies (&ldquo;Monja&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information when you use the Monja HRMS platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title} className="rounded-xl border border-white/10 bg-slate-900 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">{section.title}</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-slate-400 leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
