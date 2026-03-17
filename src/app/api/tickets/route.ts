import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import Counter from "@/models/Counter";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const priority = searchParams.get("priority") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { ticketId: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Ticket.find(filter)
      .populate("assignee", "name email role")
      .populate("comments.author", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Ticket.countDocuments(filter),
  ]);

  return NextResponse.json({ items, total, page, limit });
}

export async function POST(request: NextRequest) {
  await connectDB();
  // Ensure User model is registered for population
  void User;

  const body = await request.json();
  const { title, description, priority, category, subcategory, assigneeId } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 }
    );
  }

  // Auto-increment ticket ID
  const counter = await Counter.findOneAndUpdate(
    { name: "ticketId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const ticket = await Ticket.create({
    ticketId: `TK-${counter.seq}`,
    title,
    description,
    priority: priority || "Medium",
    category: category || "Technical Support",
    subcategory,
    assignee: assigneeId || undefined,
  });

  return NextResponse.json(ticket, { status: 201 });
}
