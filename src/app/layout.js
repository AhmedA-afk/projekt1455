import { Inter } from "next/font/google";
import "./globals.css";

import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Projekt 1455",
  description: "Countdown to 2030",
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
