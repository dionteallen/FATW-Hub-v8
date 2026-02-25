import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const businessName = String(form.get("businessName") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const tier = String(form.get("tier") || "TIER_100") as any;
  const contactName = String(form.get("contactName") || "").trim();

  if (!businessName || !email) return NextResponse.json({ error: "Missing businessName or email" }, { status: 400 });

  const sponsor = await prisma.sponsor.upsert({
    where: { email },
    update: { businessName, tier, contactName: contactName || undefined },
    create: { businessName, email, tier, contactName: contactName || undefined },
  });

  await prisma.user.upsert({
    where: { email },
    update: { sponsorId: sponsor.id, role: "SPONSOR" },
    create: { email, sponsorId: sponsor.id, role: "SPONSOR" },
  });

  await prisma.auditLog.create({
    data: {
      actor: "admin",
      action: "sponsor_linked",
      entity: "Sponsor",
      entityId: sponsor.id,
      meta: { email, tier, businessName },
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `http://${req.headers.get("host")}`;
  return NextResponse.redirect(new URL("/admin", baseUrl));
}
