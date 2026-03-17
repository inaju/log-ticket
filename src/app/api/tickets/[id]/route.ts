import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  void User;

  const { id } = await params;

  const ticket = await Ticket.findById(id)
    .populate("assignee", "name email role")
    .populate("comments.author", "name email role")
    .lean();

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  void User;

  const { id } = await params;
  const body = await request.json();

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  )
    .populate("assignee", "name email role")
    .populate("comments.author", "name email role")
    .lean();

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const ticket = await Ticket.findByIdAndDelete(id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Ticket deleted" });
}
