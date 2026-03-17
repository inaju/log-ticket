"use client";

import { useEffect, useState, use } from "react";
import { TicketDetail } from "@/components/tickets/ticket-detail";
import { PageTransition } from "@/components/ui/animated";
import { Ticket } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        if (!res.ok) {
          setError("Ticket not found");
          return;
        }
        const data = await res.json();
        data.id = data._id;
        if (data.comments) {
          data.comments = data.comments.map((c: Record<string, unknown>) => ({
            ...c,
            id: c._id,
            createdAt: c.createdAt || c.updatedAt,
          }));
        }
        setTicket(data);
      } catch {
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error || "Ticket not found"}</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <TicketDetail ticket={ticket} />
    </PageTransition>
  );
}
