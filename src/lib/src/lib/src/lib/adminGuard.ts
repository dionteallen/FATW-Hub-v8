import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function requireAdmin() {
  const isAdmin = cookies().get("fatw_admin")?.value === "1";
  if (!isAdmin) redirect("/access");
}
