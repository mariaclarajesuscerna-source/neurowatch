import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NeurowatchProvider } from "@/components/NeurowatchProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neurowatch — Huaraz",
  description:
    "NeuroWatch: tecnología que cuida tu vida, con raíces que nos unen. Herramienta asistiva de monitoreo de salud en tiempo real.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B555B",
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
        <NeurowatchProvider>
          {children}
        </NeurowatchProvider>
      </body>
    </html>
  );
}
