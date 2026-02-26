import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { sha256, randomToken } from "../../../../../lib/crypto";
import { sendEmail } from "../../../../../lib/email";

function getBaseUrl(req: Request) {
  const env = process.env.NEXTAUTH_URL;
  if (env) return env.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  await requireAdmin();

  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const stageName = String(form.get("stageName") || "").trim();
  const showDateStr = String(form.get("showDate") || "").trim();
  const venue = String(form.get("venue") || "").trim();
  const expiryDays = Math.max(1, Math.min(60, Number(form.get("expiryDays") || 14)));

  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const showDate = showDateStr ? new Date(`${showDateStr}T19:00:00`) : null;

  const artist = await prisma.artist.upsert({
    where: { email },
    update: { stageName: stageName || undefined, venue: venue || undefined, showDate: showDate || undefined, status: "ACCESS_SENT" },
    create: { email, stageName: stageName || undefined, venue: venue || undefined, showDate: showDate || undefined, status: "ACCESS_SENT" },
  });

  const token = randomToken(32);
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  await prisma.artistAccessLink.create({ data: { artistId: artist.id, tokenHash, expiresAt } });

  const baseUrl = getBaseUrl(req);
  const link = `${baseUrl}/artist/claim?token=${token}`;

  const subject = "FATW Artist Portal Link — Contract + Intake";
  const text = `Hi ${stageName || "there"},\n\nYou’re scheduled for Family Along the Way (#FATW).\n\nOpen your private Artist Portal (Contract + Intake):\n${link}\n\nThis link is tied to your email and expires on ${expiresAt.toDateString()}.\n\n— FATW`;
  const html = `<p>Hi ${stageName || "there"},</p>
  <p>You’re scheduled for <strong>Family Along the Way (#FATW)</strong>.</p>
  <p><a href="${link}" style="display:inline-block;padding:10px 14px;border-radius:12px;background:#111827;color:#fff;text-decoration:none;">Open Artist Portal</a></p>
  <p class="small">This link is private, tied to your email, and expires on <strong>${expiresAt.toDateString()}</strong>.</p>
  <p>— FATW</p>`;

  await sendMail({ to: email, subject, text, html });

  await prisma.auditLog.create({ data: { actor: "admin", action: "artist_link_sent", entity: "Artist", entityId: artist.id, meta: { email, expiresAt: expiresAt.toISOString() } } });

  return NextResponse.redirect(new URL("/admin", baseUrl));
}
