import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn("table-wrap", className)}>
      <div className="table-scroll">
        <table className="table-base">{children}</table>
      </div>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <th className={cn("th", className)}>{children}</th>;
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("td", className)}>{children}</td>;
}
