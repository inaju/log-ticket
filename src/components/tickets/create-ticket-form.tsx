"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

const categoryOptions = [
  { value: "Technical Support", label: "Technical" },
  { value: "Billing", label: "Billing" },
  { value: "Feature Request", label: "Feature Request" },
  { value: "Security", label: "Security" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Frontend", label: "Frontend" },
  { value: "Authentication", label: "Authentication" },
];

export function CreateTicketForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Technical Support");
  const [, setFiles] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, category }),
      });

      if (res.ok) {
        router.push("/tickets");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-2xl">
        <Input
          id="title"
          label="Ticket Title"
          placeholder="e.g., Cannot access billing portal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Please describe the problem in detail..."
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="priority"
            label="Priority Level"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
          <Select
            id="category"
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <FileUpload onFilesChange={setFiles} />

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !title || !description}
            className="w-full sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
