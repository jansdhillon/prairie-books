import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const defaultUrl = process.env.NODE_ENV === "production" ? "https://kathrinsbooks.com" : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Prairie Books",
  description: "A simple book store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-10 items-center">
              <Nav/>
              <div className="flex flex-1 flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>

              <Footer/>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
