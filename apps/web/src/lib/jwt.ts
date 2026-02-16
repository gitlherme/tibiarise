import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY =
  process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-prod";
const key = new TextEncoder().encode(SECRET_KEY);

export async function signInviteToken(partyId: string): Promise<string> {
  return await new SignJWT({ partyId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Invite links expire in 24 hours
    .sign(key);
}

export async function verifyInviteToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.partyId as string;
  } catch (error) {
    console.error("JWT Verification failed:", error); // DEBUG
    return null;
  }
}
