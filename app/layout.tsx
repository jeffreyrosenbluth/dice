"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/app/ui/footer";
import AppNavbar from "@/app/ui/AppNavbar";
import { StateProvider } from "@/app/ctx";
import { AuthProvider, useAuth } from "@/app/authctx";
import { Providers } from "@/app/providers";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// Component for handling keyboard shortcuts
function KeyboardShortcuts() {
  const { coinGameUseTimer, setCoinGameUseTimer } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+X (or Cmd+Shift+X on Mac) to reset localStorage
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'X' || event.key === 'x')) {
        event.preventDefault();
        if (confirm('Reset all data? This will clear localStorage and reload the page.')) {
          localStorage.clear();
          window.location.reload();
        }
      }

      // Ctrl+Shift+M (or Cmd+Shift+M on Mac) to toggle timer mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'M' || event.key === 'm')) {
        event.preventDefault();
        setCoinGameUseTimer(!coinGameUseTimer);
        const mode = !coinGameUseTimer ? 'Timer' : 'Finish Button';
        alert(`Coin game mode switched to: ${mode}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [coinGameUseTimer, setCoinGameUseTimer]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark">
      <body className="bg-slate-950 `${inter.className} antialiased ">
        <AuthProvider>
          <Providers>
            <StateProvider>
              <KeyboardShortcuts />
              <AppNavbar />
              {children}
            </StateProvider>
          </Providers>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
