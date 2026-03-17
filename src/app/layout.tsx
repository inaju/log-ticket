import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataStore - Ticketing System",
  description: "Manage and track customer support requests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 antialiased`}>
        <Sidebar />
        {/* pt-14 on mobile for fixed top bar, lg:pt-0 + lg:ml-60 for desktop sidebar */}
        <main className="pt-14 lg:pt-0 lg:ml-60 min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
