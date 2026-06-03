import Image from "next/image";
import type { AttendanceRecord, MyTodayStatus } from "@/lib/actions/attendance";
import { LocationName } from "@/components/location/location-name";

const STATUS_BADGE: Record<string, string> = {
  PRESENT: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  LATE: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  REMOTE: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  ON_LEAVE: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  ABSENT: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  HALF_DAY: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
};

const STATUS_LABEL: Record<string, string> = {
  PRESENT: "Present", LATE: "Late", REMOTE: "Remote",
  ON_LEAVE: "On Leave", ABSENT: "Absent", HALF_DAY: "Half Day",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function fmtHours(hoursWorked: number | null, checkIn: string | null, checkOut: string | null) {
  if (hoursWorked) return `${hoursWorked}h`;
  if (checkIn && !checkOut) return "In progress";
  return "—";
}

interface Props {
  records: AttendanceRecord[];
  myStatus: MyTodayStatus;
}

export function AttendanceTable({ records, myStatus }: Readonly<Props>) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-2 dark:border-dark-3">
        <h3 className="section-title">Today&apos;s Attendance</h3>
        <span className="text-xs text-dark-5 dark:text-dark-6">{records.length} records</span>
      </div>

      {records.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-dark-5 dark:text-dark-6">No attendance records yet today.</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Records appear when employees check in.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-2 bg-gray-1 dark:border-dark-3 dark:bg-dark-3/50">
                {["Employee", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-gray-2 dark:border-dark-3 last:border-0 hover:bg-gray-1 dark:hover:bg-dark-3/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Image
                        src={r.employee.avatarUrl ?? "/images/user/user-01.png"}
                        alt={r.employee.firstName}
                        width={32} height={32}
                        className="rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium text-dark dark:text-white">{r.employee.firstName} {r.employee.lastName}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{r.employee.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{fmt(r.checkIn)}</td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{fmt(r.checkOut)}</td>
                  <td className="px-5 py-3.5 text-dark dark:text-white font-medium">
                    <p>{fmtHours(r.hoursWorked, r.checkIn, r.checkOut)}</p>
                    <p className="mt-0.5 text-xs font-normal text-dark-5 dark:text-dark-6">
                      In loc: <LocationName latitude={r.checkInLatitude} longitude={r.checkInLongitude} />
                    </p>
                    <p className="text-xs font-normal text-dark-5 dark:text-dark-6">
                      Out loc: <LocationName latitude={r.checkOutLatitude} longitude={r.checkOutLongitude} />
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[r.status] ?? ""}`}>
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {myStatus && (
        <div className="border-t border-gray-2 dark:border-dark-3 bg-primary-50 dark:bg-primary-900/10 px-5 py-3">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-300">
            Your session today: In {fmt(myStatus.checkIn)}
            {myStatus.checkOut ? ` · Out ${fmt(myStatus.checkOut)} · ${myStatus.hoursWorked}h worked` : " · Still active"}
          </p>
          <p className="mt-1 text-xs text-primary-600/90 dark:text-primary-300/90">
            In location: <LocationName latitude={myStatus.checkInLatitude} longitude={myStatus.checkInLongitude} /> · Out location: <LocationName latitude={myStatus.checkOutLatitude} longitude={myStatus.checkOutLongitude} />
          </p>
        </div>
      )}
    </div>
  );
}
