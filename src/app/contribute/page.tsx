import Link from "next/link";

export default function About() {
  return (
    <div className="text-center flex flex-col gap-8">
      <h1 className="font-black text-3xl text-blue-500">
        Contribute to Tibia Rise
      </h1>
      <div className="flex flex-col gap-4">
        <p>
          Want to contribute to the continued development of TibiaRise? Donate
          some Tibia Coins to{" "}
          <Link
            className="font-bold text-blue-500 hover:text-blue-700"
            href="/character/Gui"
            target="_blank"
          >
            Gui
          </Link>
          .
        </p>
        <p>
          Please also send me a letter in game, I really appreciate all support
          and will be happy to read about your feedbacks and thougts about the
          product.
        </p>
      </div>
    </div>
  );
}
