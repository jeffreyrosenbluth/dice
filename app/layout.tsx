import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import Footer from "@/app/ui/footer";
import { StateProvider } from "@/app/ctx";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Investment Dice Simulation",
  description:
    "A Simulation of Risk and Wealth When Investing in the Stock Market",
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Play", href: "/play" },
  { label: "Simulation", href: "/simulation" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-slate-700 `${inter.className} antialiased`">
        <Navbar className="bg-slate-950 border-b border-gray-700">
          <NavbarContent className="hidden sm:flex gap-4">
            <NavbarItem>
              <Link className="text-white" href="/">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link className="text-white" href="/play">
                Play
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link className="text-white" href="/simulation">
                Simulation
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent className="sm:flex hidden" justify="end">
            <NavbarItem>
              <Link className="text-white" href="/about">
                About
              </Link>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
        <Providers>
          <StateProvider>{children}</StateProvider>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
