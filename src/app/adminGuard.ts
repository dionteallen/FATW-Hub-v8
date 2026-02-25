import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) redirect("/signin");
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!me || me.role !== "ADMIN") redirect("/admin/unauthorized");
  return { session, me };
}
