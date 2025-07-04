import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../providers";
import DashboardHeader from "@/components/DashBoardHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remotia | Client",
  description: "Task Management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <DashboardHeader />
          <body className="antialiased">{children}</body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
