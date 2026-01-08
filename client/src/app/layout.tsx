import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeartSpeak AI | Speak Without Words",
  description:
    "AI-powered multimodal communication platform that transforms non-verbal expressions into meaningful emotional communication, enabling mute individuals to speak their hearts fluently.",
  keywords: [
    "communication",
    "accessibility",
    "AI",
    "emotion recognition",
    "speech impaired",
    "AAC",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
