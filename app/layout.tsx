import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Workflow Manager",
  description: "4-system AI taming framework: manuals, memory, quality gates, shortcuts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <nav className="h-12 bg-white border-b border-gray-200 flex items-center px-6 gap-6 shrink-0">
          <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm">
            🤖 AI Workflow Manager
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/manuals" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Manuals
            </Link>
            <Link href="/memory" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Memory
            </Link>
          </div>
        </nav>
        <main className="h-[calc(100vh-3rem)] overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
