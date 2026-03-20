import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShieldGrid | Parametric Income Protection",
  description:
    "AI-powered parametric income protection for India's delivery heroes. Instant UPI payouts, trigger-based coverage, and transparent dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased bg-slate-50 text-slate-900`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
