import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { NeurowatchProvider } from "@/components/NeurowatchProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neurowatch — Monitoreo de salud en tiempo real",
  description:
    "Herramienta asistiva de detección de anomalías de salud. Monitoreo de pulso en tiempo real y chequeo facial. No reemplaza atención médica.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LanguageProvider>
          <NeurowatchProvider>
            {children}
          </NeurowatchProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
