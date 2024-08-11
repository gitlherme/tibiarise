import Link from "next/link";
import { Button } from "../ui/button";

export const Header = () => (
  <div className="bg-secondary-foreground">
    <div className="flex justify-center md:justify-between container mx-auto py-6 items-center">
      <Link href="/" className="block text-secondary">
        <span className="block text-3xl font-black">TIBIA XP</span>
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <ul className="flex gap-8 text-secondary">
          <li>Home</li>
          <li>About</li>
          <li>Sponsor</li>
          <li>Contact</li>
        </ul>

        <div>
          <Button variant="secondary">Login</Button>
        </div>
      </div>
    </div>
  </div>
);
