import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { ToastContainer } from 'react-toastify';
import { Unbounded } from "next/font/google"; 

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded",
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
    <html lang="en" className={`${unbounded.variable} scroll-smooth`}>
      <body className="antialiased">
        <ClerkProvider>
          <Providers>
            {children}
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
      </body>
    </html>
  );
}
