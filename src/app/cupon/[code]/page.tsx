import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CouponPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/?cupon=${encodeURIComponent(code)}`);
}
