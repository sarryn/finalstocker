import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageTitle({ title, subtitle, actions }: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-col md:flex-row gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
