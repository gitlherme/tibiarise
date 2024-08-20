import Link from "next/link";
import { Button } from "../ui/button";

export const Header = () => (
  <div className="bg-secondary-foreground mb-12">
    <div className="flex justify-center md:justify-between container mx-auto py-6 items-center">
      <Link href="/" className="block text-secondary">
        <span className="block text-3xl font-black">Tibia Rise</span>
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <ul className="flex gap-8 text-secondary">
          <li>
            <Link href="/" className="hover:text-blue-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-300">
              About
            </Link>
          </li>
        </ul>
        <Button variant="secondary">
          <Link
            data-canny-link
            href="https://tibia-rise.canny.io/feature-requests"
            target="_blank"
          >
            Suggest a feature! ✨
          </Link>
        </Button>
      </div>
    </div>
  </div>
);
