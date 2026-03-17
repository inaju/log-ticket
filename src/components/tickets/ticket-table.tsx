"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Ticket, Priority, Status, Category } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";

interface TicketTableProps {
  tickets: Ticket[];
  initialSearch?: string;
}

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Technical Support", label: "Technical Support" },
  { value: "Billing", label: "Billing" },
  { value: "Feature Request", label: "Feature Request" },
  { value: "Security", label: "Security" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Frontend", label: "Frontend" },
  { value: "Authentication", label: "Authentication" },
];

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
  { value: "Reopened", label: "Reopened" },
];

export function TicketTable({ tickets, initialSearch = "" }: TicketTableProps) {
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !categoryFilter || t.category === (categoryFilter as Category);
      const matchPriority =
        !priorityFilter || t.priority === (priorityFilter as Priority);
      const matchStatus =
        !statusFilter || t.status === (statusFilter as Status);
      return matchSearch && matchCategory && matchPriority && matchStatus;
    });
  }, [tickets, search, categoryFilter, priorityFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const displayed = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SearchInput
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={categoryOptions}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={priorityOptions}
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
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
                  <td className="px-6 py-4">
                    <Link
                      href={`/tickets/${ticket._id || ticket.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      #{ticket.ticketId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ticket.category}</td>
                  <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ticket.assignee?.name || "Unassigned"}</td>
                </motion.tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-gray-100">
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
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ticket.category}</p>
                  </div>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium text-blue-600">#{ticket.ticketId}</span>
                  <StatusBadge status={ticket.status} />
                  <span className="ml-auto">{ticket.assignee?.name || "Unassigned"}</span>
                </div>
              </Link>
            </motion.div>
          ))}
          {displayed.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-400">No tickets found.</div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              itemsPerPage={perPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
