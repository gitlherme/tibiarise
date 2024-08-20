import Link from "next/link";

export const Footer = () => (
  <footer className="py-8 flex items-center justify-center bg-black text-white mt-12">
    <span>
      Made with 💙 by{" "}
      <Link
        href="https://github.com/gitlherme"
        target="_blank"
        className="text-blue-300 hover:text-blue-500"
      >
        gitlherme
      </Link>
    </span>
  </footer>
);
