import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orbital — AI Agent Operating System for Sales & Marketing Agencies",
  description: "Deploy autonomous AI agents that place calls, operate browsers, and run backend CLI workflows — synchronized as one multi-agent agency workforce.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7] selection:bg-purple-600 selection:text-white font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
