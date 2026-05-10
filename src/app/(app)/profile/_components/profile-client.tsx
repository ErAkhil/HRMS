"use client";

import Image from "next/image";
import Breadcrumb from "@/components/layout/breadcrumb";

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  department: string | null;
  avatarUrl: string | null;
  startDate: string;
  employmentType: string;
  goalsDone: number;
  tasksDone: number;
  coursesCount: number;
  certsCount: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ProfileClient({ profile }: Readonly<{ profile: Profile | null }>) {
  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="card flex h-40 items-center justify-center">
          <p className="text-muted">No employee profile found. Contact HR to set up your profile.</p>
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const avatar = profile.avatarUrl ?? "/images/user/user-01.png";
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Cover */}
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src="/images/cover/cover-01.png"
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Avatar + Info */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative">
              {profile.avatarUrl ? (
                <Image
                  src={avatar}
                  width={160}
                  height={160}
                  className="overflow-hidden rounded-full object-cover"
                  alt={fullName}
                />
              ) : (
                <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-primary-100 text-4xl font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                  {initials}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">{fullName}</h3>
            <p className="font-medium text-dark-5 dark:text-dark-6">{profile.title}</p>
            {profile.department && (
              <p className="mt-0.5 text-sm text-muted">{profile.department} · {profile.employmentType}</p>
            )}

            {/* Stats */}
            <div className="mx-auto mb-5.5 mt-5 grid max-w-[420px] grid-cols-4 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
              {[
                { label: "Goals", value: profile.goalsDone },
                { label: "Tasks", value: profile.tasksDone },
                { label: "Courses", value: profile.coursesCount },
                { label: "Certs", value: profile.certsCount },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row ${i < arr.length - 1 ? "border-r border-stroke dark:border-dark-3" : ""}`}
                >
                  <span className="font-semibold text-dark dark:text-white">{stat.value}</span>
                  <span className="text-body-sm text-muted">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="mx-auto max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">About</h4>
              <div className="mt-4 space-y-1.5 text-sm text-muted">
                <p><span className="font-medium text-dark dark:text-white">Email:</span> {profile.email}</p>
                <p><span className="font-medium text-dark dark:text-white">Department:</span> {profile.department ?? "—"}</p>
                <p><span className="font-medium text-dark dark:text-white">Joined:</span> {formatDate(profile.startDate)}</p>
                <p><span className="font-medium text-dark dark:text-white">Employment:</span> {profile.employmentType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
