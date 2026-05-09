import Image from "next/image";

type AttendanceStatus = "Present" | "Late" | "WFH" | "On Leave" | "Absent";

interface Employee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: AttendanceStatus;
}

const employees: Employee[] = [
  { id: 1, name: "Sarah Mitchell", avatar: "/images/user/user-01.png", role: "Product Manager", clockIn: "9:02 AM", clockOut: "6:15 PM", hours: "9h 13m", status: "Present" },
  { id: 2, name: "Daniel Park", avatar: "/images/user/user-02.png", role: "Frontend Engineer", clockIn: "9:45 AM", clockOut: "6:30 PM", hours: "8h 45m", status: "Late" },
  { id: 3, name: "Priya Sharma", avatar: "/images/user/user-03.png", role: "UX Designer", clockIn: "—", clockOut: "—", hours: "—", status: "WFH" },
  { id: 4, name: "James Williams", avatar: "/images/user/user-04.png", role: "Backend Engineer", clockIn: "8:55 AM", clockOut: "5:58 PM", hours: "9h 03m", status: "Present" },
  { id: 5, name: "Elena Torres", avatar: "/images/user/user-05.png", role: "HR Specialist", clockIn: "—", clockOut: "—", hours: "—", status: "On Leave" },
  { id: 6, name: "Arjun Mehta", avatar: "/images/user/user-06.png", role: "Data Analyst", clockIn: "9:01 AM", clockOut: "—", hours: "6h 32m", status: "Present" },
  { id: 7, name: "Marcus Johnson", avatar: "/images/user/user-07.png", role: "DevOps Engineer", clockIn: "9:30 AM", clockOut: "6:00 PM", hours: "8h 30m", status: "Late" },
  { id: 8, name: "Zara Ahmed", avatar: "/images/user/user-08.png", role: "Marketing Lead", clockIn: "—", clockOut: "—", hours: "—", status: "WFH" },
  { id: 9, name: "Tom Bradley", avatar: "/images/user/user-09.png", role: "Sales Manager", clockIn: "8:48 AM", clockOut: "5:45 PM", hours: "8h 57m", status: "Present" },
  { id: 10, name: "Nina Patel", avatar: "/images/user/user-10.png", role: "QA Engineer", clockIn: "—", clockOut: "—", hours: "—", status: "Absent" },
];

const statusBadge: Record<AttendanceStatus, string> = {
  Present: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Late: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  WFH: "rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-400",
  "On Leave": "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Absent: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

export function AttendanceTable() {
  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-3 dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Today&apos;s Attendance</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search employee..."
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-3 dark:border-dark-3">
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Clock In</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Clock Out</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Hours</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={emp.avatar}
                      alt={emp.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">{emp.name}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm text-dark dark:text-white">{emp.clockIn}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm text-dark dark:text-white">{emp.clockOut}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm font-medium text-dark dark:text-white">{emp.hours}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={statusBadge[emp.status]}>{emp.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
