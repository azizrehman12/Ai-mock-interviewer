"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  // Function to check if the link is active
  const isActive = (route) =>
    path === route ? "text-blue-600 font-bold" : "text-gray-700 font-bold";

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md">
      <Image src="/logo.svg" width={160} height={100} alt="logo" />

      <ul className="hidden md:flex gap-6">
        <li
          className={`cursor-pointer transition-all hover:text-blue-600 ${isActive("/")}`}
        >
          Dashboard
        </li>
        <li
          className={`cursor-pointer transition-all hover:text-blue-600 ${isActive("/questions")}`}
        >
          Questions
        </li>
        <li
          className={`cursor-pointer transition-all hover:text-blue-600 ${isActive("/upgrade")}`}
        >
          Upgrade
        </li>
        <li
          className={`cursor-pointer transition-all hover:text-blue-600 ${isActive("/how-it-works")}`}
        >
          How it Works?
        </li>
      </ul>

      <UserButton />
    </div>
  );
}

export default Header;
