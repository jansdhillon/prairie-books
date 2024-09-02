import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react"


export const metadata: Metadata = {
  title: "Prairie Books",
  description: "Buy books from Calgary, Alberta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <body
          className={`${GeistSans.className} bg-gradient-to-br from-background to-accent/20  flex flex-col`}
        >
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
