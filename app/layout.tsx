import HeaderAuth from "@/components/header-auth";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Feedback from "@/components/feedback";
import { Toaster } from "@/components/ui/toaster";
import { Viewport } from "next";
import { getURL } from "@/utils/helpers";
import { TooltipProvider } from "@/components/ui/tooltip";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: getURL(),
  title: "Kathrin's Books",
  description: "A curated online book store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background ">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <div className="flex flex-col justify-between h-full">
              <Nav headerAuth={<HeaderAuth />} />
              <main className="mt-20 w-full overflow-x-clip ">
                <Feedback>{children}</Feedback>
              </main>
              <Footer />
            </div>

            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
