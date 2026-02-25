import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const showDate = String(form.get("showDate") || "").trim();
  const theme = String(form.get("theme") || "").trim();
  const venueName = String(form.get("venueName") || "").trim();
  const city = String(form.get("city") || "").trim();
  const state = String(form.get("state") || "").trim();
  const artistName = String(form.get("artistName") || "").trim();
  const artistEmail = String(form.get("artistEmail") || "").trim().toLowerCase();

  if (!title || !showDate) return NextResponse.json({ error: "Missing title/showDate" }, { status: 400 });

  const dt = new Date(`${showDate}T19:00:00`);
  await prisma.episode.create({
    data: { title, showDate: dt, theme: theme || undefined, venueName: venueName || undefined, city: city || undefined, state: state || undefined, artistName: artistName || undefined, artistEmail: artistEmail || undefined },
  });

  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `http://${req.headers.get("host")}`;
  return NextResponse.redirect(new URL("/admin/episodes", baseUrl));
}
