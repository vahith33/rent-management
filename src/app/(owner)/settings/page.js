import SettingsClient from "@/components/owner/SettingsClient";
import { getOwnerInfo } from "@/actions/owner";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const ownerInfo = await getOwnerInfo()

  if (!ownerInfo) {
    redirect('/login')
  }

  return <SettingsClient initialData={ownerInfo} />;
}
