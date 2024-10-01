"use client";

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
  // const { setModel } = useStateContext();
  const {
    user,
    coinComplete,
    setCoinComplete,
    diceComplete,
    setDiceComplete,
    coinGameEnabled,
    coinSimEnabled,
    diceGameEnabled,
    diceSimEnabled,
    loading,
  } = useAuth();

  const router = useRouter();

  const handleAuthClick = async () => {
    router.push("/login"); // Redirect to login page
  };

  if (loading) {
    return <Spinner />;
  }

  const coinDisabledKeys = () => {
    const play = user && coinGameEnabled;
    const sim = user && coinSimEnabled && coinComplete;
    if (play && sim) return [];
    if (play) return ["simulation"];
    if (sim) return ["play"];
    return ["play", "simulation"];
  };

  const diceDisabledKeys = () => {
    const play = user && diceGameEnabled;
    const sim = user && diceSimEnabled && diceComplete;
    if (play && sim) return [];
    if (play) return ["simulation"];
    if (sim) return ["play"];
    return ["play", "simulation"];
  };

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
        <NavbarItem>
          <Link href="/calibrate">Calibrate Utility</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/trackrec">Track Record</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:flex hidden" justify="end">
        <NavbarItem>{user ? user.email!.split("@")[0] : null}</NavbarItem>
        <NavbarItem>
          {!user ? (
            <Button variant="flat" onClick={handleAuthClick}>
              Sign In
            </Button>
          ) : (
            <Button isIconOnly variant="light" onClick={handleAuthClick}>
              <Image src="/user.svg" alt="User" width={32} />
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AppNavbar;
