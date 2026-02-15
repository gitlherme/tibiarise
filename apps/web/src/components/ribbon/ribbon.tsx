"use client";

import { X } from "lucide-react";
import { ReactNode, useState } from "react";

type RibbonProps = {
  children: ReactNode;
  enabled?: boolean;
};

export const Ribbon = ({ children, enabled = false }: RibbonProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!enabled || !isVisible) return null;

  return (
    <div className="bg-primary text-white w-full p-4 text-center relative animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="pr-10">{children}</div>
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
