import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { ToastContainer, toast } from 'react-toastify';
import { Header } from "@/components/Header";


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

        <Header/>
       <html lang="en">
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
