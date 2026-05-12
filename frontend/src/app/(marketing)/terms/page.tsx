import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — Monja" };

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    content: `By accessing or using Monja ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

If you do not agree to these Terms, do not use the Service.`,
  },
  {
    title: "2. Description of service",
    content: `Monja is a cloud-based Human Resource Management System (HRMS) that provides tools for employee management, payroll processing, attendance tracking, leave management, performance reviews, team collaboration, and AI-powered workforce insights.

The Service is available on subscription plans (Basic, Pro, Pro Max) with features varying by plan. We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.`,
  },
  {
    title: "3. Account registration",
    content: `To use the Service, you must create an account. You agree to:

- Provide accurate, current, and complete information during registration
- Maintain the security of your password and account credentials
- Notify us immediately of any unauthorized access to your account
- Accept responsibility for all activity that occurs under your account

Each organization account (workspace) is separate. You may not share credentials between organizations or access another organization's data.`,
  },
  {
    title: "4. Subscription and payment",
    content: `Paid plans (Pro and Pro Max) are billed monthly or annually in advance. By subscribing:

- You authorize us to charge your payment method on a recurring basis
- All fees are exclusive of applicable taxes (including GST)
- Fees are non-refundable except as required by law or as stated in our refund policy
- You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period
- We reserve the right to change pricing with 30 days' notice

Failure to pay may result in suspension or termination of your account.`,
  },
  {
    title: "5. Your data and privacy",
    content: `You retain full ownership of all data you upload, input, or generate through the Service ("Customer Data"). By using the Service, you grant us a limited license to process your Customer Data solely to provide and improve the Service.

We will not sell, rent, or share your Customer Data with third parties except as described in our Privacy Policy. You are responsible for obtaining any necessary consents from your employees for data processing under applicable law (including the DPDP Act, 2023).`,
  },
  {
    title: "6. Acceptable use",
    content: `You agree not to use the Service to:

- Violate any applicable law or regulation
- Process data of minors under 18 without appropriate consent
- Transmit malware, viruses, or harmful code
- Attempt to gain unauthorized access to other organizations' data
- Reverse engineer, decompile, or disassemble the Service
- Use the Service for competitive benchmarking or to build a competing product
- Overload or disrupt the Service's infrastructure

We reserve the right to suspend accounts that violate this acceptable use policy without notice.`,
  },
  {
    title: "7. Intellectual property",
    content: `The Service, including its software, design, logos, and documentation, is owned by Monja Technologies and protected by intellectual property laws. These Terms do not grant you any right to use Monja's trademarks, logos, or brand names.

Any feedback, suggestions, or ideas you provide about the Service may be used by us without compensation or attribution to you.`,
  },
  {
    title: "8. Limitation of liability",
    content: `To the maximum extent permitted by law, Monja shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or business interruption.

Our total liability for any claim arising from these Terms or your use of the Service shall not exceed the fees paid by you in the 12 months preceding the claim.`,
  },
  {
    title: "9. Termination",
    content: `Either party may terminate these Terms at any time. Upon termination:

- Your access to the Service will cease immediately
- We will provide you a 30-day window to export your data
- After 30 days, your data will be permanently deleted

We may terminate or suspend your account immediately if you breach these Terms or if required by law.`,
  },
  {
    title: "10. Governing law",
    content: `These Terms are governed by the laws of India, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka, India.

For disputes valued at less than ₹10 lakhs, the parties agree to attempt resolution through mediation before pursuing litigation.`,
  },
  {
    title: "11. Changes to terms",
    content: `We may modify these Terms at any time. We will provide at least 30 days' notice of material changes via email or in-platform notification. Continued use of the Service after the effective date of changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: "12. Contact",
    content: `For questions about these Terms, contact us at:

Monja Technologies
Legal Team
Email: legal@monja.app
Bangalore, Karnataka, India`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-slate-400">
            Last updated: <span className="text-slate-300">May 1, 2026</span>
          </p>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Please read these Terms of Service carefully before using Monja. They form a binding agreement between you and Monja Technologies.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div key={section.title} className="rounded-xl border border-white/10 bg-slate-900 p-6">
                <h2 className="text-base font-semibold text-white mb-3">{section.title}</h2>
                <div className="space-y-3">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{para}</p>
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
