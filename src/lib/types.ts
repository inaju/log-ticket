export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "Open" | "In Progress" | "Resolved" | "Closed" | "Reopened";
export type Category =
  | "Technical Support"
  | "Billing"
  | "Feature Request"
  | "Security"
  | "Infrastructure"
  | "Frontend"
  | "Authentication";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Comment {
  _id?: string;
  id?: string;
  author: User;
  content: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface LinkedTicket {
  _id?: string;
  id?: string;
  ticketId: string;
  title: string;
  type: "Parent" | "Child" | "Duplicate";
}

export interface Ticket {
  _id?: string;
  id?: string;
  ticketId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: Category;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  targetResolution?: string;
  comments: Comment[];
  linkedTickets: LinkedTicket[];
  subcategory?: string;
}

export interface DashboardStats {
  totalOpen: number;
  inProgress: number;
  resolved: number;
  reopened: number;
}
