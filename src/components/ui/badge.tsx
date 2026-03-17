import { Priority, Status } from "@/lib/types";

const priorityStyles: Record<Priority, string> = {
  Low: "bg-blue-100 text-blue-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
  Critical: "bg-purple-100 text-purple-700",
};

const statusStyles: Record<Status, string> = {
  Open: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-200 text-gray-600",
  Reopened: "bg-orange-100 text-orange-700",
};

const statusDotColors: Record<Status, string> = {
  Open: "bg-gray-400",
  "In Progress": "bg-blue-500",
  Resolved: "bg-green-500",
  Closed: "bg-gray-400",
  Reopened: "bg-orange-500",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  );
}

export function StatusBadge({
  status,
  withDot = false,
}: {
  status: Status;
  withDot?: boolean;
}) {
  if (withDot) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
        <span
          className={`w-2 h-2 rounded-full ${statusDotColors[status]}`}
        />
        {status}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium uppercase ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function LinkedTicketBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    Parent: "bg-blue-100 text-blue-700",
    Child: "bg-green-100 text-green-700",
    Duplicate: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${styles[type] || "bg-gray-100 text-gray-700"}`}
    >
      {type}
    </span>
  );
}
