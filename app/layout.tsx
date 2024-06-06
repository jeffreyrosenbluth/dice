import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/ui/navbar";
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
        <Navbar links={navLinks} />
        <StateProvider>{children}</StateProvider>
      </body>
    </html>
  );
}
