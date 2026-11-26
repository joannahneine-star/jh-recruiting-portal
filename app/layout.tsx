import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recruiting Copilot Portal",
  description:
    "Open roles, shortlists, pipeline and bot test results for the AI Recruiting Copilot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans text-gray-800">
        <NavBar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-gray-50">
          <p className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6">
            Built by Joanna Hneine – Project 3: AI Recruiting Copilot (n8n +
            GoHighLevel + Slack + Claude Code)
          </p>
        </footer>
      </body>
    </html>
  );
}
