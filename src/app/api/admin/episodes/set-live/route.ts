import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const episodeId = String(form.get("episodeId") || "").trim();

  await prisma.appSetting.upsert({
    where: { key: "LIVE_EPISODE_ID" },
    update: { value: episodeId || "" },
    create: { key: "LIVE_EPISODE_ID", value: episodeId || "" },
  });

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `http://${req.headers.get("host")}`;
  return NextResponse.redirect(new URL("/admin/episodes", baseUrl));
}
