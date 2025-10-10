"use client";

import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="p-3 flex justify-end border border-zinc-400">
        <UserButton />
      </div>
    </>
  );
}
