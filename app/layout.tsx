"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/app/ui/footer";
import AppNavbar from "@/app/ui/AppNavbar";
import { StateProvider } from "@/app/ctx";
import { AuthProvider } from "@/app/authctx";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

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
