"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Zap,
  CheckCircle,
  RotateCcw,
  Plus,
  Bell,
  MoreVertical,
} from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import {
  dashboardStats as fallbackStats,
  tickets as fallbackTickets,
} from "@/lib/data";
import { DashboardStats, Ticket } from "@/lib/types";

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

const statsConfig = [
  {
    key: "totalOpen" as const,
    label: "Total Open",
    icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />,
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
  },
  {
    key: "resolved" as const,
    label: "Resolved",
    icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />,
  },
  {
    key: "reopened" as const,
    label: "Reopened",
    icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [tickets, setTickets] = useState<Ticket[]>(
    fallbackTickets.filter(
      (t) => t.status === "Open" || t.status === "In Progress"
    )
  );
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 4;
  const total = tickets.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const displayed = tickets.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/tickets?limit=20"),
        ]);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          const active = (ticketsData.items || []).filter(
            (t: Ticket) => t.status === "Open" || t.status === "In Progress"
          );
          if (active.length > 0) setTickets(active);
        }
      } catch {
        // fallback data already set
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/tickets?search=${encodeURIComponent(searchValue.trim())}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 shrink-0">
          System Dashboard
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block w-56">
            <SearchInput
              placeholder="Search tickets..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <Link href="/tickets/new">
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Ticket</span>
            </Button>
          </Link>
          <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden mb-4">
        <SearchInput
          placeholder="Search tickets..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Stats */}
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
          At A Glance
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsConfig.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{
                y: -4,
                boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 flex items-start justify-between cursor-default"
            >
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {stats[s.key]}
                </p>
              </div>
              <div>{s.icon}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="bg-white rounded-lg border border-gray-200"
      >
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            My Active Tickets
          </h2>
          <Link
            href="/tickets"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((ticket, i) => (
                <motion.tr
                  key={ticket._id || ticket.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{ticket.ticketId}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/tickets/${ticket._id || ticket.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.title}
                      </p>
                      {ticket.subcategory && (
                        <p className="text-xs text-gray-400">
                          {ticket.category} / {ticket.subcategory}
                        </p>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} withDot />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {timeAgo(ticket.updatedAt)}
                  </td>
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
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
            >
              <Link
                href={`/tickets/${ticket._id || ticket.id}`}
                className="block px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 flex-1 pr-2">
                    {ticket.title}
                  </p>
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

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-blue-600">
            Showing {displayed.length} of {total} tickets
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
      </motion.div>
    </motion.div>
  );
}
