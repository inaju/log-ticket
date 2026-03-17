"use client";

import { motion } from "framer-motion";
import { Status } from "@/lib/types";

const steps: { label: string; status: Status }[] = [
  { label: "OPEN", status: "Open" },
  { label: "IN PROGRESS", status: "In Progress" },
  { label: "RESOLVED", status: "Resolved" },
  { label: "CLOSED", status: "Closed" },
  { label: "REOPENED", status: "Reopened" },
];

export function StatusStepper({ currentStatus }: { currentStatus: Status }) {
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isActive = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-500 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } ${isCurrent ? "ring-2 ring-blue-200" : ""}`}
              >
                {i + 1}
              </motion.div>
              <span
                className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 sm:mx-2 mt-[-20px] bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                  className="h-full bg-blue-600"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
