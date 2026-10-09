import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { TourProvider } from "@/context/TourContext";
import { GuidedTourOverlay } from "@/components/tour/GuidedTourOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MeetScribe - Meeting Notes & Transcription Platform",
  description: "Intelligent meeting notes, real-time transcription, and automated action items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#100730] text-slate-100 font-sans antialiased selection:bg-[#5925DC] selection:text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          <TourProvider>
            <AppShell>{children}</AppShell>
            <GuidedTourOverlay />
          </TourProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
