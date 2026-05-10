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
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 divider">
        <h3 className="section-title">Today&apos;s Attendance</h3>
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
            <tr className="thead-row">
              <th className="th">Employee</th>
              <th className="th">Clock In</th>
              <th className="th">Clock Out</th>
              <th className="th">Hours</th>
              <th className="th">Status</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="tr-body">
                <td className="td">
                  <div className="flex items-center gap-3">
                    <Image
                      src={emp.avatar}
                      alt={emp.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-body-medium">{emp.name}</p>
                      <p className="text-muted">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="td">{emp.clockIn}</td>
                <td className="td">{emp.clockOut}</td>
                <td className="td font-medium">{emp.hours}</td>
                <td className="td">
                  <span className={statusBadge[emp.status]}>{emp.status}</span>
                </td>
                <td className="td">
                  <button className="btn-secondary">
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
