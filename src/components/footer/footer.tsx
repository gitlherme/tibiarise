import Link from "next/link";
import { DiscordLogo } from "@phosphor-icons/react/dist/ssr";

export const Footer = () => (
  <footer className="py-8 flex gap-4 flex-col items-center justify-center text-center bg-foreground text-white mt-12">
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

    <span className="text-xs">
      <Link href="https://tibia.com" target="_blank" className="text-blue-300">
        Tibia
      </Link>{" "}
      is a registered trademark of{" "}
      <Link
        href="https://www.cipsoft.com/en/"
        target="_blank"
        className="text-blue-300"
      >
        CipSoft GmbH
      </Link>
      . Tibia and all related content are copyrighted.
    </span>

    <span className="text-xs">
      Thanks for
      <Link
        href="https://tibiadata.com/"
        target="_blank"
        className="text-blue-300 px-1"
      >
        TibiaData
      </Link>
      for providing the data used in this website.
    </span>
  </footer>
);
