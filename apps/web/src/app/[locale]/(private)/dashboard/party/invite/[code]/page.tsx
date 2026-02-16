import { prisma } from "@/lib/db";
import { verifyInviteToken } from "@/lib/jwt";
import { PartyInviteView } from "@/views/dashboard/party-invite";

interface InvitePageProps {
  params: {
    code: string;
  };
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  console.log("InvitePage params code:", code); // DEBUG

  let partyId: string | null = null;
  try {
    partyId = await verifyInviteToken(code);
    console.log("InvitePage verifyInviteToken result:", partyId); // DEBUG
  } catch (err) {
    console.error("InvitePage verifyInviteToken error:", err); // DEBUG
  }

  if (!partyId) {
    // TEMPORARY DEBUGGING UI
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-500">
          Invalid or Expired Link
        </h1>
        <p className="text-muted-foreground mt-2">
          Debug Info: Token verification failed.
        </p>
        <p className="text-xs text-muted-foreground mt-4 break-all font-mono bg-muted p-2 rounded">
          {code}
        </p>
      </div>
    );
    // notFound();
  }

  const party = await prisma.party.findUnique({
    where: { id: partyId },
    select: {
      id: true,
      name: true,
      description: true,
      members: { select: { id: true } },
      isActive: true,
    },
  });

  if (!party || !party.isActive) {
    console.log("InvitePage party not found or inactive:", partyId); // DEBUG
    // TEMPORARY DEBUGGING UI
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-500">Party Not Found</h1>
        <p className="text-muted-foreground mt-2">Debug Info: ID {partyId}</p>
      </div>
    );
    // notFound();
  }

  return <PartyInviteView inviteCode={code} party={party} />;
}
