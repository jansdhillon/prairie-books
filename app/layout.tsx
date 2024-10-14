import HeaderAuth from "@/components/header-auth";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Feedback from "@/components/feedback";
import { Toaster } from "@/components/ui/toaster";
import { Viewport } from "next";
import { getURL } from "@/utils/helpers";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

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
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-background h-full flex flex-col justify-between ">
            <Nav headerAuth={<HeaderAuth />} />
            <main className="mt-20 font-normal container  mx-auto max-w-5xl flex flex-col space-y-12   px-8 md:px-12 py-8">
              <Feedback>{children}</Feedback>
            </main>
            <Footer />
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
