"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PriorityBadge, LinkedTicketBadge } from "@/components/ui/badge";
import { StatusStepper } from "@/components/ui/status-stepper";
import { Paperclip, Plus } from "lucide-react";
import { FadeIn } from "@/components/ui/animated";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TicketDetail({ ticket }: { ticket: Ticket }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(ticket.comments);
  const [posting, setPosting] = useState(false);

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);

    try {
      const res = await fetch(`/api/tickets/${ticket._id || ticket.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setComment("");
      }
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 flex-wrap">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                #{ticket.ticketId}
              </span>
              <span>Created {timeAgo(ticket.createdAt)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{ticket.title}</h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="flex-1 sm:flex-none">Edit</Button>
            <Button className="flex-1 sm:flex-none">Action</Button>
          </div>
        </div>
      </FadeIn>

      {/* Status Stepper */}
      <FadeIn delay={0.1}>
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-2">
          <div className="min-w-[500px] px-4">
            <StatusStepper currentStatus={ticket.status} />
          </div>
        </div>
      </FadeIn>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Description */}
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Description</h2>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {ticket.description.split("\n").map((line, i) => {
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="ml-4 list-disc">
                          {line.slice(2)}
                        </li>
                      );
                    }
                    return <p key={i} className={line ? "" : "h-4"}>{line}</p>;
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Activity History */}
          <FadeIn delay={0.2}>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Activity History
              </h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {comments.map((c, i) =>
                    c.isSystem ? (
                      <motion.div
                        key={c._id || c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="border-l-2 border-gray-300 pl-4 py-2 ml-4 sm:ml-12"
                      >
                        <p
                          className="text-sm text-gray-500 italic"
                          dangerouslySetInnerHTML={{
                            __html: c.content.replace(/\*(.*?)\*/g, "<strong>$1</strong>"),
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={c._id || c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="hidden sm:block">
                          <Avatar name={c.author.name} />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="sm:hidden">
                                <Avatar name={c.author.name} size="sm" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {c.author.name}
                                </span>
                                <span className="text-sm text-gray-400 ml-2">
                                  {c.author.role}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">
                              {timeAgo(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{c.content}</p>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>

          {/* Add Comment */}
          <FadeIn delay={0.25}>
            <Card>
              <CardContent>
                <form onSubmit={handlePostComment}>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Add a comment
                  </p>
                  <Textarea
                    placeholder="Write your update here..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-3">
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      <Paperclip className="w-4 h-4" />
                      Attach Files
                    </Button>
                    <Button
                      type="submit"
                      disabled={posting || !comment.trim()}
                      className="w-full sm:w-auto"
                    >
                      {posting ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Ticket Properties */}
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Ticket Properties
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Priority
                  </p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Category
                  </p>
                  <p className="text-sm text-gray-900">
                    {ticket.category}
                    {ticket.subcategory ? ` & ${ticket.subcategory}` : ""}
                  </p>
                </div>
                {ticket.assignee && (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      Assignee
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={ticket.assignee.name} size="sm" />
                        <span className="text-sm text-gray-900">
                          {ticket.assignee.name}
                        </span>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Change
                      </button>
                    </div>
                  </div>
                )}
                {ticket.targetResolution && (
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      Target Resolution
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(ticket.targetResolution)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Linked Tickets */}
          {ticket.linkedTickets.length > 0 && (
            <FadeIn delay={0.3}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Linked Tickets
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ticket.linkedTickets.map((lt, i) => (
                    <motion.div
                      key={lt._id || lt.id || i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                      className="space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <LinkedTicketBadge type={lt.type} />
                        <span className="text-sm text-blue-600 font-medium">
                          #{lt.ticketId}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{lt.title}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 py-6 text-center text-xs sm:text-sm text-gray-400 border-t border-gray-200">
        &copy; {new Date().getFullYear()} DataStore Ticketing System. All rights reserved.
      </footer>
    </div>
  );
}
