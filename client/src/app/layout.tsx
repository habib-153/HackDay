import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeartSpeak AI | Communicate Without Words",
  description:
    "AI-powered platform that transforms facial expressions and emotions into meaningful communication for speech-impaired individuals. SDG 3: Good Health & Wellbeing.",
  keywords: [
    "communication",
    "accessibility",
    "AI",
    "emotion recognition",
    "speech impaired",
    "SDG",
    "health",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
