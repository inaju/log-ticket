"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  index?: number;
}

export function StatsCard({ label, value, icon, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 flex items-start justify-between cursor-default transition-colors"
    >
      <div>
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="text-xl sm:text-2xl">{icon}</div>
    </motion.div>
  );
}
