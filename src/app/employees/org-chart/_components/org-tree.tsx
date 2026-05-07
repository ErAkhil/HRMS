import { OrgNode } from "./org-node";

export function OrgTree() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[700px]">
        {/* ─── Level 0: CEO ─── */}
        <div className="flex justify-center">
          <OrgNode
            avatar="/images/user/user-25.png"
            name="Michael Chen"
            title="Chief Executive Officer"
            isRoot
          />
        </div>

        {/* Vertical connector from CEO */}
        <div className="flex justify-center">
          <div className="h-8 w-px bg-gray-3 dark:bg-dark-3" />
        </div>

        {/* Horizontal line spanning all dept heads */}
        <div className="relative mx-auto flex justify-center">
          <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-gray-3 dark:bg-dark-3" />
        </div>

        {/* ─── Level 1: C-Suite ─── */}
        <div className="grid grid-cols-4 gap-4">
          {/* CTO branch */}
          <div className="flex flex-col items-center gap-0">
            <div className="h-8 w-px bg-gray-3 dark:bg-dark-3" />
            <OrgNode
              avatar="/images/user/user-13.png"
              name="David Kim"
              title="CTO"
              department="Engineering"
              reportsCount={45}
              isHead
            />
            <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
            {/* Horizontal connector for CTO's reports */}
            <div className="relative w-full">
              <div className="absolute top-0 left-[16.67%] right-[16.67%] h-px bg-gray-3 dark:bg-dark-3" />
            </div>
            <div className="grid w-full grid-cols-3 gap-2">
              {[
                {
                  avatar: "/images/user/user-01.png",
                  name: "Sarah Mitchell",
                  title: "Sr. Engineer",
                },
                {
                  avatar: "/images/user/user-08.png",
                  name: "Marcus Johnson",
                  title: "Backend Eng.",
                },
                {
                  avatar: "/images/user/user-09.png",
                  name: "Zara Ahmed",
                  title: "DevOps Eng.",
                },
              ].map((report) => (
                <div key={report.name} className="flex flex-col items-center">
                  <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
                  <OrgNode
                    avatar={report.avatar}
                    name={report.name}
                    title={report.title}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CPO branch */}
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-gray-3 dark:bg-dark-3" />
            <OrgNode
              avatar="/images/user/user-14.png"
              name="Rachel Green"
              title="CPO"
              department="Product"
              reportsCount={18}
              isHead
            />
            <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
            <div className="relative w-full">
              <div className="absolute top-0 left-[25%] right-[25%] h-px bg-gray-3 dark:bg-dark-3" />
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              {[
                {
                  avatar: "/images/user/user-02.png",
                  name: "Daniel Park",
                  title: "Product Mgr.",
                },
                {
                  avatar: "/images/user/user-03.png",
                  name: "Priya Sharma",
                  title: "UX Designer",
                },
              ].map((report) => (
                <div key={report.name} className="flex flex-col items-center">
                  <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
                  <OrgNode
                    avatar={report.avatar}
                    name={report.name}
                    title={report.title}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CFO branch */}
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-gray-3 dark:bg-dark-3" />
            <OrgNode
              avatar="/images/user/user-16.png"
              name="Robert Stone"
              title="CFO"
              department="Finance"
              reportsCount={12}
              isHead
            />
            <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
              <OrgNode
                avatar="/images/user/user-06.png"
                name="Arjun Mehta"
                title="Fin. Analyst"
              />
            </div>
          </div>

          {/* CHRO branch */}
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-gray-3 dark:bg-dark-3" />
            <OrgNode
              avatar="/images/user/user-05.png"
              name="Elena Torres"
              title="CHRO"
              department="HR"
              reportsCount={8}
              isHead
            />
            <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-gray-3 dark:bg-dark-3" />
              <OrgNode
                avatar="/images/user/user-11.png"
                name="Nina Patel"
                title="Recruiter"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
