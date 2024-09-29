import Link from "next/link";

export const Header = () => (
  <div className="bg-secondary-foreground mb-12">
    {/* <Link
      className="md:hidden text-center bg-blue-300 text-blue-900 py-2 w-full block"
      data-canny-link
      href="https://tibiarise.canny.io/feature-requests"
      target="_blank"
    >
      Suggest a feature! ✨
    </Link> */}
    <div className="flex flex-col md:flex-row justify-center md:justify-between container mx-auto py-6 items-center">
      <Link href="/" className="block text-secondary">
        <span className="block text-3xl font-black">Tibia Rise</span>
      </Link>

      <div className="flex flex-col md:flex-row items-center md:gap-12">
        <ul className="flex flex-row my-4 md:my-0 gap-4 md:gap-8 text-secondary">
          <li>
            <Link href="/" className="hover:text-blue-300">
              Search Character
            </Link>
          </li>
          <li>
            <Link href="/world" className="hover:text-blue-300">
              Experience by World
            </Link>
          </li>
          <li>
            <Link href="/compare-characters" className="hover:text-blue-300">
              Compare Characters
            </Link>
          </li>
          <li>
            <Link href="/contribute" className="hover:text-blue-300">
              Contribute
            </Link>
          </li>
        </ul>
        {/* <Button className="hidden md:block" variant="secondary">
          <Link
            data-canny-link
            href="https://tibiarise.canny.io/feature-requests"
            target="_blank"
          >
            Suggest a feature! ✨
          </Link>
        </Button> */}
      </div>
    </div>
  </div>
);
