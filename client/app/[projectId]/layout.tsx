import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../providers";
import { ToastContainer } from "react-toastify";
import DashboardHeader from "@/components/DashBoardHeader"
import { Unbounded } from "next/font/google"; 

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remotia | Client",
  description: "Task Management app",
};


const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded",
});

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
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="Toastify__toast"
          progressClassName="Toastify__progress-bar"
        />
      </Providers>
    </ClerkProvider>
  );
}
