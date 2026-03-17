import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

export async function GET() {
  await connectDB();

  const [totalOpen, inProgress, resolved, reopened] = await Promise.all([
    Ticket.countDocuments({ status: "Open" }),
    Ticket.countDocuments({ status: "In Progress" }),
    Ticket.countDocuments({ status: "Resolved" }),
    Ticket.countDocuments({ status: "Reopened" }),
  ]);

  return NextResponse.json({ totalOpen, inProgress, resolved, reopened });
}
