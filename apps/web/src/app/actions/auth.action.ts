"use server";

import { signIn, signOut } from "@/auth";

export const signInGoogleAction = async () => {
  return await signIn("google");
};

export const signOutAction = async () => {
  return await signOut();
};
