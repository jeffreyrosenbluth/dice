import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/ui/navmenu";
import { StateProvider } from "@/app/ctx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Investment Dice Simulation",
  description:
    "A Simulation of Risk and Wealth When Investing in the Stock Market",
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Simulation", href: "/simulation" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-slate-700">
        <Navbar about={{ href: "/about" }} links={navLinks} />
        <StateProvider>{children}</StateProvider>
        <div className="flex flex-row text-sm justify-center pt-12 font-thin">
          © Copyright 2024 Jeffrey M. Rosenbluth
        </div>
      </body>
    </html>
  );
}
