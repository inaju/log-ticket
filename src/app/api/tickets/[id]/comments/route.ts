import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await request.json();
  const { content, authorId } = body;

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  // Default to first user if no authorId provided
  let author = authorId;
  if (!author) {
    const defaultUser = await User.findOne();
    if (!defaultUser) {
      return NextResponse.json(
        { error: "No users found. Please seed the database." },
        { status: 400 }
      );
    }
    author = defaultUser._id;
  }

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: {
          author,
          content,
          isSystem: false,
        },
      },
    },
    { new: true }
  )
    .populate("comments.author", "name email role")
    .lean();

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Return the newly added comment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = ticket as any;
  const newComment = doc.comments[doc.comments.length - 1];
  return NextResponse.json(newComment, { status: 201 });
}
