"use client";

import Image from "next/image";
import WealthPlot from "@/app/ui/wealth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center">
        <WealthPlot />
      </div>
    </main>
  );
}
