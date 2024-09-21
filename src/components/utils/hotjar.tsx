"use client";
import Hotjar from "@hotjar/browser";
export const HotjarSnippet = () => {
  const siteId = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;
  const hotjarVersion = 6;
  return Hotjar.init(Number(siteId), hotjarVersion);
};
