"use client";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import Link from "next/link";
import { useState } from "react";
import { headerLinks } from "@/data/header-links";

export const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer direction="left" open={isOpen}>
      <div className="flex items-center bg-black p-4 gap-14">
        <DrawerTrigger onClick={() => setIsOpen(true)}>
          <Button>
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <Link href="/" className="block text-secondary text-white">
          <span className="block text-3xl font-black">Tibia Rise</span>
        </Link>
      </div>
      <DrawerContent className="h-screen rounded-none flex items-center text-center px-4">
        <XIcon className="self-end my-4" onClick={() => setIsOpen(false)} />

        <div className="flex justify-center items-center w-full my-8">
          <Link href="/" className="block text-secondary text-black">
            <span className="block text-3xl font-black">Tibia Rise</span>
          </Link>
        </div>
        <ul className="flex flex-col my-4 gap-4 w-full">
          {headerLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="hover:text-blue-300 block w-full py-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
};
