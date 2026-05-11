import { getAuditLogs } from "@/lib/actions/audit";
import { AuditClient } from "./_components/AuditClient";

function getDefaultDates() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { from: fmt(firstDay), to: fmt(now) };
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; type?: string }>;
}) {
  const defaults = getDefaultDates();
  const { from = defaults.from, to = defaults.to, type = "All" } = await searchParams;

  const logs = await getAuditLogs({ from, to, type }).catch(() => []);

  return <AuditClient logs={logs} from={from} to={to} type={type} />;
}
