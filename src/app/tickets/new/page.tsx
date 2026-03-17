"use client";

import { CreateTicketForm } from "@/components/tickets/create-ticket-form";
import { PageTransition } from "@/components/ui/animated";

export default function NewTicketPage() {
  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Ticket</h1>
        <p className="text-sm text-gray-500 mt-1">
          Please provide details about your issue or request.
        </p>
      </div>

      <CreateTicketForm />
    </PageTransition>
  );
}
