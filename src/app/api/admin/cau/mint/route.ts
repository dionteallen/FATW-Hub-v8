import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const CAU_ABI = [
  {
    type: "function",
    name: "mintCAU",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [],
  },
] as const;

export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const wallet = String(form.get("wallet") || "").trim() as `0x${string}`;
  const amount = BigInt(Math.max(1, Number(form.get("amount") || 1)));

  const contract = (process.env.CAU_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_CAU_CONTRACT_ADDRESS || "") as `0x${string}`;
  const pk = process.env.ADMIN_PRIVATE_KEY as `0x${string}` | undefined;
  const rpc = process.env.BASE_RPC_URL || "https://mainnet.base.org";

  if (!email || !wallet) return NextResponse.json({ error: "Missing email or wallet" }, { status: 400 });
  if (!contract) return NextResponse.json({ error: "Missing CAU_CONTRACT_ADDRESS" }, { status: 500 });
  if (!pk) return NextResponse.json({ error: "Missing ADMIN_PRIVATE_KEY" }, { status: 500 });

  // Optional audit: ensure at least one Eventbrite order exists for this email.
  const hasOrder = await prisma.eventbriteOrder.findFirst({ where: { buyerEmail: email } });

  const account = privateKeyToAccount(pk);
  const client = createWalletClient({ account, chain: base, transport: http(rpc) });

  const hash = await client.writeContract({
    address: contract,
    abi: CAU_ABI,
    functionName: "mintCAU",
    args: [wallet, amount],
  });

  await prisma.user.upsert({
    where: { email },
    update: { walletAddress: wallet },
    create: { email, walletAddress: wallet },
  });

  await prisma.auditLog.create({
    data: {
      actor: "admin",
      action: "cau_minted",
      entity: "User",
      entityId: email,
      meta: { email, wallet, amount: amount.toString(), tx: hash, verifiedOrder: Boolean(hasOrder) },
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `http://${req.headers.get("host")}`;
  return NextResponse.redirect(new URL("/admin", baseUrl));
}
