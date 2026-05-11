import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, badge, className }: PageHeaderProps) {
  return (
    <div className={cn("page-header", className)}>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="page-title">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-muted mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
