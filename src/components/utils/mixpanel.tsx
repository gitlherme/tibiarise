"use client";

import { initMixpanel } from "@/lib/mixpanel";
import { useEffect } from "react";

export const Mixpanel = () => {
  useEffect(() => {
    initMixpanel();
  }, []);

  return <></>;
};
