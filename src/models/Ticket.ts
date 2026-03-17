import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  isSystem?: boolean;
  createdAt: Date;
}

export interface ILinkedTicket {
  ticketId: string;
  title: string;
  type: "Parent" | "Child" | "Duplicate";
}

export interface ITicket extends Document {
  ticketId: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed" | "Reopened";
  category: string;
  subcategory?: string;
  assignee?: Types.ObjectId;
  targetResolution?: Date;
  comments: IComment[];
  linkedTickets: ILinkedTicket[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LinkedTicketSchema = new Schema<ILinkedTicket>(
  {
    ticketId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["Parent", "Child", "Duplicate"], required: true },
  },
  { _id: false }
);

const TicketSchema = new Schema<ITicket>(
  {
    ticketId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed", "Reopened"],
      default: "Open",
    },
    category: { type: String, required: true },
    subcategory: { type: String },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    targetResolution: { type: Date },
    comments: [CommentSchema],
    linkedTickets: [LinkedTicketSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
