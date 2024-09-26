import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Head from "next/head";
import Feedback from "@/components/feedback";
import { Suspense } from "react";
import Loading from "./loading";
import { Skeleton } from "@/components/ui/skeleton";

const defaultUrl =
  process.env.NODE_ENV === "production"
    ? "https://kathrinsbooks.com"
    : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Kathrin's Books",
  description: "A curated online book store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground font-normal">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Suspense
              fallback={<Skeleton className="w-full h-full bg-accent" />}
            >
              <Nav headerAuth={<HeaderAuth />} />
            </Suspense>

            <main className="flex-1 mt-20">

            <Suspense  fallback={<Skeleton className="w-full h-full bg-accent" />}>
                  <div className="max-auto max-w-5xl container">
                    <Feedback />
                  </div>
                </Suspense>
              <div className="container  mx-auto max-w-5xl px-4 py-8">

                {children}
              </div>
              {/* <Feedback /> */}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
