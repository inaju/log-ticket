"use client";

import Link from "next/link";
import { Ticket } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ActiveTicketsTableProps {
  tickets: Ticket[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function ActiveTicketsTable({ tickets }: ActiveTicketsTableProps) {
  const perPage = 4;
  const [page, setPage] = useState(1);
  const total = tickets.length;
  const totalPages = Math.ceil(total / perPage);
  const displayed = tickets.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">My Active Tickets</h2>
        <Link href="/tickets" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View All
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-200 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayed.map((ticket, i) => (
              <motion.tr
                key={ticket._id || ticket.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{ticket.ticketId}</td>
                <td className="px-6 py-4">
                  <Link href={`/tickets/${ticket._id || ticket.id}`} className="hover:text-blue-600 transition-colors">
                    <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                    {ticket.subcategory && (
                      <p className="text-xs text-gray-400">{ticket.category} / {ticket.subcategory}</p>
                    )}
                  </Link>
                </td>
                <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                <td className="px-6 py-4"><StatusBadge status={ticket.status} withDot /></td>
                <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(ticket.updatedAt)}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-100 border-t border-gray-200">
        {displayed.map((ticket, i) => (
          <motion.div
            key={ticket._id || ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/tickets/${ticket._id || ticket.id}`}
              className="block px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 flex-1 pr-2">{ticket.title}</p>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="font-medium">#{ticket.ticketId}</span>
                <StatusBadge status={ticket.status} withDot />
                <span className="ml-auto">{timeAgo(ticket.updatedAt)}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-blue-600">
          Showing {displayed.length} of {total}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
