import SettingsClient from "@/components/owner/SettingsClient";
import { getOwnerInfo } from "@/actions/owner";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const ownerInfo = await getOwnerInfo()

  if (!ownerInfo) {
    redirect('/login')
  }

  // Add a placeholder email since it's not in the DB yet
  const data = {
    ...ownerInfo,
    email: ownerInfo.email || `${ownerInfo.name.toLowerCase().replace(' ', '.')}@stayease.com`
  }

  return <SettingsClient initialData={data} />;
}
