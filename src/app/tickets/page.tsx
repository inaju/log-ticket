"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketTable } from "@/components/tickets/ticket-table";
import { PageTransition } from "@/components/ui/animated";
import { Ticket } from "@/lib/types";
import { Suspense } from "react";

function TicketsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets?limit=100");
        const data = await res.json();
        setTickets(data.items || []);
      } catch {
        console.error("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track customer support requests.
          </p>
        </div>
        <Link href="/tickets/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Create New Ticket
          </Button>
        </Link>
      </div>

      <TicketTable tickets={tickets} initialSearch={initialSearch} />
    </PageTransition>
  );
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
