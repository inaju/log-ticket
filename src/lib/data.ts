import { Ticket, User, DashboardStats } from "./types";

export const currentUser: User = {
  id: "u1",
  name: "Alex Rivera",
  email: "alex@example.com",
  role: "System Admin",
};

export const users: User[] = [
  currentUser,
  {
    id: "u2",
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    role: "Support Lead",
  },
  {
    id: "u3",
    name: "Michael Ross",
    email: "michael@example.com",
    role: "Developer",
  },
  {
    id: "u4",
    name: "Mark Thompson",
    email: "mark@example.com",
    role: "Support Agent",
  },
  {
    id: "u5",
    name: "John Doe",
    email: "john@example.com",
    role: "User",
  },
];

export const tickets: Ticket[] = [
  {
    id: "1",
    ticketId: "TK-1042",
    title: "Database connection timeout in production",
    description:
      "The production database is experiencing intermittent connection timeouts affecting multiple services. The issue started after the last deployment.",
    priority: "High",
    status: "Open",
    category: "Technical Support",
    subcategory: "Database",
    assignee: users[1],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    targetResolution: "2024-01-16T17:00:00Z",
    comments: [
      {
        id: "c1",
        author: users[1],
        content:
          "I've verified the logs. It seems to be an issue with the API handshake with the payment gateway provider. Escalating this to the dev team.",
        createdAt: "2024-01-15T12:00:00Z",
      },
      {
        id: "c2",
        author: users[1],
        content:
          "Status changed from *In Progress* to *Resolved* by Sarah Jenkins.",
        createdAt: "2024-01-15T13:00:00Z",
        isSystem: true,
      },
      {
        id: "c3",
        author: users[2],
        content:
          "Patch deployed to production. Handshake timeout increased and retry logic improved for corporate gateways.",
        createdAt: "2024-01-15T14:00:00Z",
      },
    ],
    linkedTickets: [
      {
        id: "lt1",
        ticketId: "TK-8800",
        title: "Quarterly Payment Gateway Maintenance",
        type: "Parent",
      },
      {
        id: "lt2",
        ticketId: "TK-8845",
        title: "Refund request for failed txn #442",
        type: "Child",
      },
    ],
  },
  {
    id: "2",
    ticketId: "TK-1041",
    title: "Update billing contact information",
    description:
      "Need to update the billing contact information for our enterprise account. The current contact has left the company.",
    priority: "Medium",
    status: "In Progress",
    category: "Billing",
    assignee: users[3],
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
    comments: [],
    linkedTickets: [],
  },
  {
    id: "3",
    ticketId: "TK-1040",
    title: "Export to CSV feature request",
    description:
      "Users have requested the ability to export ticket data to CSV format for reporting purposes.",
    priority: "Low",
    status: "Open",
    category: "Feature Request",
    subcategory: "Reports",
    createdAt: "2024-01-13T14:00:00Z",
    updatedAt: "2024-01-13T14:00:00Z",
    comments: [],
    linkedTickets: [],
  },
  {
    id: "4",
    ticketId: "TK-1039",
    title: "SSL Certificate renewal failed",
    description:
      "The automatic SSL certificate renewal process failed for the staging environment. Manual intervention required.",
    priority: "High",
    status: "Resolved",
    category: "Security",
    assignee: users[1],
    createdAt: "2024-01-12T16:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
    comments: [
      {
        id: "c4",
        author: users[1],
        content: "Certificate has been manually renewed. Investigating the automation failure.",
        createdAt: "2024-01-13T09:00:00Z",
      },
    ],
    linkedTickets: [],
  },
  {
    id: "5",
    ticketId: "TK-4029",
    title: "Database connection timeout in production",
    description: "Production DB connections timing out intermittently.",
    priority: "High",
    status: "In Progress",
    category: "Infrastructure",
    subcategory: "Database",
    assignee: users[2],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:36:00Z",
    comments: [],
    linkedTickets: [],
  },
  {
    id: "6",
    ticketId: "TK-3982",
    title: "User login failing via OAuth",
    description: "Multiple users reporting OAuth login failures with Google SSO.",
    priority: "Medium",
    status: "In Progress",
    category: "Authentication",
    subcategory: "Login",
    assignee: users[1],
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    comments: [],
    linkedTickets: [],
  },
  {
    id: "7",
    ticketId: "TK-4011",
    title: "New feature request: Export to PDF",
    description: "Add ability to export reports to PDF format.",
    priority: "Low",
    status: "Open",
    category: "Frontend",
    subcategory: "Reports",
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
    comments: [],
    linkedTickets: [],
  },
  {
    id: "8",
    ticketId: "TK-3810",
    title: "Broken images on mobile view",
    description: "Images on the mobile layout are not rendering correctly.",
    priority: "Medium",
    status: "In Progress",
    category: "Frontend",
    subcategory: "UI",
    assignee: users[3],
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
    comments: [],
    linkedTickets: [],
  },
  {
    id: "9",
    ticketId: "TK-8842",
    title: "Unable to process payment using Corporate Credit Card",
    description:
      'The user reported that when attempting to check out using a Corporate Amex card, the system returns a generic "Processing Error 500". This issue has been replicated in the staging environment.\n\nSteps to reproduce:\n\n- Log in as a corporate entity\n- Add items to cart > Proceed to checkout\n- Select \'Corporate Card\' payment method',
    priority: "High",
    status: "Resolved",
    category: "Billing",
    subcategory: "Payments",
    assignee: users[1],
    createdAt: "2024-01-13T08:00:00Z",
    updatedAt: "2024-01-15T14:00:00Z",
    targetResolution: "2024-10-24T17:00:00Z",
    comments: [
      {
        id: "c5",
        author: users[1],
        content:
          "I've verified the logs. It seems to be an issue with the API handshake with the payment gateway provider. Escalating this to the dev team.",
        createdAt: "2024-01-15T12:00:00Z",
      },
      {
        id: "c6",
        author: users[1],
        content:
          "Status changed from *In Progress* to *Resolved* by Sarah Jenkins.",
        createdAt: "2024-01-15T13:00:00Z",
        isSystem: true,
      },
      {
        id: "c7",
        author: users[2],
        content:
          "Patch deployed to production. Handshake timeout increased and retry logic improved for corporate gateways.",
        createdAt: "2024-01-15T14:00:00Z",
      },
    ],
    linkedTickets: [
      {
        id: "lt3",
        ticketId: "TK-8800",
        title: "Quarterly Payment Gateway Maintenance",
        type: "Parent",
      },
      {
        id: "lt4",
        ticketId: "TK-8845",
        title: "Refund request for failed txn #442",
        type: "Child",
      },
      {
        id: "lt5",
        ticketId: "TK-8849",
        title: "Payment error on Amex card",
        type: "Duplicate",
      },
    ],
  },
];

export const dashboardStats: DashboardStats = {
  totalOpen: 128,
  inProgress: 42,
  resolved: 894,
  reopened: 12,
};
