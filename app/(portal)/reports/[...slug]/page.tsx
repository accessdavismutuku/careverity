import { redirect } from "next/navigation";

export default async function ReportsGovernanceShortcutPage({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  redirect(`/careverity-ecm/reports/${slug.join("/")}`);
}
