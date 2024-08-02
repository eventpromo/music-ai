import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react"
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "music ai",
  description: "Use API to call the music generation ai of suno.ai",
  keywords: ["suno", "suno api", "suno.ai", "api", "music", "generation", "ai"],
  creator: "Peda & Co",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <UserProvider>
        <body className={`${inter.className} overflow-y-scroll`} >
          <Header />
          <main className="flex flex-col items-center m-auto w-full">
            {children}
          </main>
          <Footer />
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}