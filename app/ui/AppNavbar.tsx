"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authctx";
import { Spinner } from "@nextui-org/spinner";

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
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleAuthClick = async () => {
    if (user) {
      await supabase.auth.signOut();
      router.push("/"); // Redirect to home page after sign out
    } else {
      router.push("/login"); // Redirect to login page
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
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
          <Button variant="flat" onClick={handleAuthClick}>
            {user ? "Sign Out" : "Sign In"}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AppNavbar;
