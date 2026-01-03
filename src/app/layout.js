import { Inter } from "next/font/google";
import "./globals.css";

import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Projekt 1455",
  description: "A disciplined daily journaling application.",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "1455",
    statusBarStyle: "black-translucent",
    startupImage: ["/icons/icon-512x512.png"],
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <AuthGuard>
            <Header />
            <main style={{ paddingTop: "120px" }}> {/* Push content down (80 + 20 float + 20 buffer) */}
              {children}
            </main>
            <Navigation />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
