"use client";
import Script from "next/script";

export const Umami = () => {
  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
    />
  );
};
