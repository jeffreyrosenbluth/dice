"use client";

import Image from "next/image";
import WealthPlot from "@/app/ui/wealth";
import Button from "@/app/ui/button";
import Card from "@/app/ui/card"; // Update the import statement to match the actual file name

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <WealthPlot />
      </div>
      <div className="grid gap-8 grid-cols-3">
        <Button> Roll</Button>
        <Button>Reset</Button>
        <Button>Pink</Button>
      </div>
      <div className="grid gap-8 grid-cols-3">
        <Card className="text-emerald-400">
          <p> Wealth: $178 </p>
          <p>Annual Return: 15.15%</p>
          <p>Last Roll: 6</p>
          <p>Last Return: 22%</p>
        </Card>
        <Card className="text-rose-500">
          <p> Wealth: $178 </p>
          <p>Annual Return: 15.15%</p>
          <p>Last Roll: 6</p>
          <p>Last Return: 22%</p>
        </Card>
        <Card className="text-white">
          <p> Wealth: $178 </p>
          <p>Annual Return: 15.15%</p>
          <p>Last Roll: 6</p>
          <p>Last Return: 22%</p>
        </Card>
      </div>
    </main>
  );
}
