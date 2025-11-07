"use client";

import Link from "next/link";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
  NavbarBrand,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import { useAuth } from "@/app/authctx";

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

const AppNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    coinComplete,
    diceComplete,
    coinGameEnabled,
    coinSimEnabled,
    diceGameEnabled,
    diceSimEnabled,
    coinFinalBalance,
  } = useAuth();

  const coinDisabledKeys = () => {
    const play = coinGameEnabled;
    const sim = coinSimEnabled && coinComplete;
    if (play && sim) return [];
    if (play) return ["simulation"];
    if (sim) return ["play"];
    return ["play", "simulation"];
  };

  const diceDisabledKeys = () => {
    const play = diceGameEnabled;
    const sim = diceSimEnabled && diceComplete;
    if (play && sim) return [];
    if (play) return ["simulation"];
    if (sim) return ["play"];
    return ["play", "simulation"];
  };

  return (
    <div className="relative">
      <Navbar
        className="bg-slate-950 border-b border-gray-700"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/" className="text-xl">
              <div className="flex flex-row items-center gap-2">
                <Image src="/elf.svg" alt="Elf" width={32} className="invert" />
                ELF
              </div>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-8" justify="center">
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
            <DropdownMenu disabledKeys={coinDisabledKeys()}>
              <DropdownItem key="play">
                <Link href="/coinplay" className="w-full h-full block">
                  Game
                </Link>
              </DropdownItem>
              <DropdownItem key="simulation">
                <Link href="/coinsim" className="w-full h-full block">
                  Simulation
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
            <DropdownMenu disabledKeys={diceDisabledKeys()}>
              <DropdownItem key="play">
                <Link href="/diceplay" className="w-full h-full block">
                  Game
                </Link>
              </DropdownItem>
              <DropdownItem key="simulation">
                <Link href="/dicesim" className="w-full h-full block">
                  Simulation
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem className="text-small font-semibold">
          <Link href="/calibrate">Calibrate Utility</Link>
        </NavbarItem>
        <NavbarItem className="text-small font-semibold">
          <Link href="/trackrec">Track Record</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-slate-950 pt-6">
        <NavbarMenuItem>
          <div className="w-full">
            <p className="text-sm text-slate-400 mb-2 px-2">Coin Flipping</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/coinplay"
                className={`w-full px-4 py-2 rounded-md ${
                  !coinGameEnabled ? "opacity-50 pointer-events-none" : "hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Game
              </Link>
              <Link
                href="/coinsim"
                className={`w-full px-4 py-2 rounded-md ${
                  !(coinSimEnabled && coinComplete) ? "opacity-50 pointer-events-none" : "hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Simulation
              </Link>
            </div>
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <div className="w-full">
            <p className="text-sm text-slate-400 mb-2 px-2">Dice Rolling</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/diceplay"
                className={`w-full px-4 py-2 rounded-md ${
                  !diceGameEnabled ? "opacity-50 pointer-events-none" : "hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Game
              </Link>
              <Link
                href="/dicesim"
                className={`w-full px-4 py-2 rounded-md ${
                  !(diceSimEnabled && diceComplete) ? "opacity-50 pointer-events-none" : "hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Simulation
              </Link>
            </div>
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/calibrate"
            className="w-full px-4 py-2 rounded-md hover:bg-slate-800 block"
            onClick={() => setIsMenuOpen(false)}
          >
            Calibrate Utility
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/trackrec"
            className="w-full px-4 py-2 rounded-md hover:bg-slate-800 block"
            onClick={() => setIsMenuOpen(false)}
          >
            Track Record
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
    {coinFinalBalance !== null && (
      <div className="hidden md:block absolute top-24 right-8 bg-slate-800 px-6 py-3 rounded-md border border-gray-600 shadow-lg min-w-[180px]">
        <div className="text-sm text-slate-400">Final Balance</div>
        <div className="text-2xl font-semibold text-green-400 break-words">
          ${coinFinalBalance.toFixed(2)}
        </div>
      </div>
    )}
    </div>
  );
};

export default AppNavbar;
