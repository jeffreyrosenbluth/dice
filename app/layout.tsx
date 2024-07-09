"use client";
// import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
  NavbarBrand,
  Image,
} from "@nextui-org/react";
import Footer from "@/app/ui/footer";
import { StateProvider } from "@/app/ctx";
import { Providers } from "@/app/providers";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Investment Dice Simulation",
//   description:
//     "A Simulation of Risk and Wealth When Investing in the Stock Market",
// };

interface ChevronDownProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
}
const ChevronDown: React.FC<ChevronDownProps> = ({
  fill,
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark">
      <body className="bg-slate-700 `${inter.className} antialiased ">
        <Navbar className="bg-slate-950 border-b border-gray-700">
          <NavbarBrand>
            <Link href="/" className="text-xl">
              <div className="flex flex-row items-center gap-2">
                <Image src="/elf.svg" alt="Elf" width={32} className="invert" />
                ELF
              </div>
            </Link>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-8">
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    endContent={<ChevronDown fill="white" size={16} />}
                    radius="sm"
                    variant="light"
                  >
                    Coin Flipping
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>
                    <Link href="/coinplay" className="w-full h-full block">
                      Game
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/coinsim" className="w-full h-full block">
                      Simulation
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/coinabout" className="w-full h-full block">
                      About
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    endContent={<ChevronDown fill="white" size={16} />}
                    radius="sm"
                    variant="light"
                  >
                    Dice Rolling
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>
                    <Link href="/diceplay" className="w-full h-full block">
                      Game
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/dicesim" className="w-full h-full block">
                      Simulation
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/diceabout" className="w-full h-full block">
                      About
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent className="sm:flex hidden" justify="end">
            <NavbarItem>
              {/* <Link className="text-white" href="/"> */}
              {/* TBD */}
              {/* </Link> */}
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
