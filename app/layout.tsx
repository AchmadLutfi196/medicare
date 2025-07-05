import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "./components/ConditionalHeader";
import { PrismaAuthProvider } from "../contexts/PrismaAuthContext";
import LoginStatusChecker from "./components/LoginStatusChecker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medicare Hospital - Pelayanan Kesehatan Terpercaya",
  description: "Rumah Sakit Medicare menyediakan layanan kesehatan berkualitas tinggi dengan fasilitas modern dan tim medis profesional. Booking online tersedia 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <PrismaAuthProvider>
          <ConditionalHeader />
          <main>
            {children}
          </main>
          {process.env.NODE_ENV !== 'production' && <LoginStatusChecker />}
        </PrismaAuthProvider>
      </body>
    </html>
  );
}
