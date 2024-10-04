import Link from "next/link";
import { DiscordLogo } from "@phosphor-icons/react/dist/ssr";

export const Footer = () => (
  <footer className="py-8 flex gap-4 flex-col items-center justify-center bg-foreground text-white mt-12">
    <span className="block">
      Made with 💙 by{" "}
      <Link
        href="https://github.com/gitlherme"
        target="_blank"
        className="text-blue-300 hover:text-blue-500"
      >
        gitlherme
      </Link>
    </span>

    <span className="block">
      <Link
        className="text-blue-200 hover:text-blue-600"
        href="mailto:contact@tibiarise.app"
      >
        contact@tibiarise.app
      </Link>
    </span>

    <span className="block">
      <Link
        className="text-blue-200 hover:text-blue-600"
        href="https://discord.gg/BAZDE29Eyf"
      >
        <DiscordLogo size={32} />
      </Link>
    </span>
  </footer>
);
