import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Counter from "@/models/Counter";

const seedUsers = [
  { name: "Alex Rivera", email: "alex@example.com", role: "System Admin" },
  { name: "Sarah Jenkins", email: "sarah@example.com", role: "Support Lead" },
  { name: "Michael Ross", email: "michael@example.com", role: "Developer" },
  { name: "Mark Thompson", email: "mark@example.com", role: "Support Agent" },
  { name: "John Doe", email: "john@example.com", role: "User" },
];

export async function POST() {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Ticket.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  // Create users
  const users = await User.insertMany(seedUsers);
  const [alex, sarah, michael, mark] = users;

  // Set counter
  await Counter.create({ name: "ticketId", seq: 1050 });

  // Create tickets
  const seedTickets = [
    {
      ticketId: "TK-1042",
      title: "Database connection timeout in production",
      description:
        "The production database is experiencing intermittent connection timeouts affecting multiple services. The issue started after the last deployment.",
      priority: "High",
      status: "Open",
      category: "Technical Support",
      subcategory: "Database",
      assignee: sarah._id,
      targetResolution: new Date("2024-01-16T17:00:00Z"),
      comments: [
        {
          author: sarah._id,
          content:
            "I've verified the logs. It seems to be an issue with the API handshake with the payment gateway provider. Escalating this to the dev team.",
          isSystem: false,
        },
        {
          author: sarah._id,
          content:
            "Status changed from *In Progress* to *Resolved* by Sarah Jenkins.",
          isSystem: true,
        },
        {
          author: michael._id,
          content:
            "Patch deployed to production. Handshake timeout increased and retry logic improved for corporate gateways.",
          isSystem: false,
        },
      ],
      linkedTickets: [
        { ticketId: "TK-8800", title: "Quarterly Payment Gateway Maintenance", type: "Parent" },
        { ticketId: "TK-8845", title: "Refund request for failed txn #442", type: "Child" },
      ],
    },
    {
      ticketId: "TK-1041",
      title: "Update billing contact information",
      description:
        "Need to update the billing contact information for our enterprise account. The current contact has left the company.",
      priority: "Medium",
      status: "In Progress",
      category: "Billing",
      assignee: mark._id,
    },
    {
      ticketId: "TK-1040",
      title: "Export to CSV feature request",
      description:
        "Users have requested the ability to export ticket data to CSV format for reporting purposes.",
      priority: "Low",
      status: "Open",
      category: "Feature Request",
      subcategory: "Reports",
    },
    {
      ticketId: "TK-1039",
      title: "SSL Certificate renewal failed",
      description:
        "The automatic SSL certificate renewal process failed for the staging environment. Manual intervention required.",
      priority: "High",
      status: "Resolved",
      category: "Security",
      assignee: sarah._id,
      comments: [
        {
          author: sarah._id,
          content: "Certificate has been manually renewed. Investigating the automation failure.",
          isSystem: false,
        },
      ],
    },
    {
      ticketId: "TK-4029",
      title: "Database connection timeout in production",
      description: "Production DB connections timing out intermittently.",
      priority: "High",
      status: "In Progress",
      category: "Infrastructure",
      subcategory: "Database",
      assignee: michael._id,
    },
    {
      ticketId: "TK-3982",
      title: "User login failing via OAuth",
      description: "Multiple users reporting OAuth login failures with Google SSO.",
      priority: "Medium",
      status: "In Progress",
      category: "Authentication",
      subcategory: "Login",
      assignee: sarah._id,
    },
    {
      ticketId: "TK-4011",
      title: "New feature request: Export to PDF",
      description: "Add ability to export reports to PDF format.",
      priority: "Low",
      status: "Open",
      category: "Frontend",
      subcategory: "Reports",
    },
    {
      ticketId: "TK-3810",
      title: "Broken images on mobile view",
      description: "Images on the mobile layout are not rendering correctly.",
      priority: "Medium",
      status: "In Progress",
      category: "Frontend",
      subcategory: "UI",
      assignee: mark._id,
    },
    {
      ticketId: "TK-8842",
      title: "Unable to process payment using Corporate Credit Card",
      description:
        'The user reported that when attempting to check out using a Corporate Amex card, the system returns a generic "Processing Error 500". This issue has been replicated in the staging environment.\n\nSteps to reproduce:\n\n- Log in as a corporate entity\n- Add items to cart > Proceed to checkout\n- Select \'Corporate Card\' payment method',
      priority: "High",
      status: "Resolved",
      category: "Billing",
      subcategory: "Payments",
      assignee: sarah._id,
      targetResolution: new Date("2024-10-24T17:00:00Z"),
      comments: [
        {
          author: sarah._id,
          content:
            "I've verified the logs. It seems to be an issue with the API handshake with the payment gateway provider. Escalating this to the dev team.",
          isSystem: false,
        },
        {
          author: sarah._id,
          content:
            "Status changed from *In Progress* to *Resolved* by Sarah Jenkins.",
          isSystem: true,
        },
        {
          author: michael._id,
          content:
            "Patch deployed to production. Handshake timeout increased and retry logic improved for corporate gateways.",
          isSystem: false,
        },
      ],
      linkedTickets: [
        { ticketId: "TK-8800", title: "Quarterly Payment Gateway Maintenance", type: "Parent" },
        { ticketId: "TK-8845", title: "Refund request for failed txn #442", type: "Child" },
        { ticketId: "TK-8849", title: "Payment error on Amex card", type: "Duplicate" },
      ],
    },
  ];

  await Ticket.insertMany(seedTickets);

  return NextResponse.json({
    message: "Database seeded successfully",
    users: users.length,
    tickets: seedTickets.length,
  });
}
