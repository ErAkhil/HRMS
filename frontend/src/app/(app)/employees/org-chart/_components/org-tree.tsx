import type { OrgEmployee } from "@/lib/actions/employees";
import { OrgNode } from "./org-node";

interface OrgNodeTree extends OrgEmployee {
  children: OrgNodeTree[];
}

function buildTree(employees: OrgEmployee[]): OrgNodeTree[] {
  const map = new Map<string, OrgNodeTree>(
    employees.map((e) => [e.id, { ...e, children: [] }]),
  );
  const roots: OrgNodeTree[] = [];
  for (const node of map.values()) {
    if (node.managerId && map.has(node.managerId)) {
      map.get(node.managerId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function OrgLevel({ nodes, isRoot = false }: { nodes: OrgNodeTree[]; isRoot?: boolean }) {
  if (nodes.length === 0) return null;
  return (
    <div className={`flex flex-wrap justify-center gap-6 ${isRoot ? "" : "mt-6"}`}>
      {nodes.map((node) => (
        <div key={node.id} className="flex flex-col items-center">
          <OrgNode
            id={node.id}
            avatar={node.avatarUrl ?? "/images/user/default-avatar.png"}
            name={`${node.firstName} ${node.lastName}`}
            title={node.title}
            department={node.department?.name}
            reportsCount={node.children.length > 0 ? node.children.length : undefined}
            isRoot={isRoot}
            isHead={!isRoot && node.children.length > 0}
          />
          {node.children.length > 0 && (
            <>
              <div className="mt-2 h-6 w-px bg-gray-3 dark:bg-dark-3" />
              <OrgLevel nodes={node.children} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

interface Props {
  employees: OrgEmployee[];
}

export function OrgTree({ employees }: Props) {
  if (employees.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-dark dark:text-white">No employees found</p>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Add employees to see the org chart.</p>
      </div>
    );
  }

  const roots = buildTree(employees);
  return (
    <div className="min-w-[600px] pb-4">
      <OrgLevel nodes={roots} isRoot />
    </div>
  );
}
