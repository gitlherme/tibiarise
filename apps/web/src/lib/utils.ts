import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTibiaCurrency(value: number | bigint): string {
  const num = Number(value);
  const absNum = Math.abs(num);

  if (absNum >= 1_000_000) {
    return `${(num / 1_000_000).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}kk`;
  }
  if (absNum >= 1_000) {
    return `${(num / 1_000).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}k`;
  }
  return num.toLocaleString("en-US");
}
