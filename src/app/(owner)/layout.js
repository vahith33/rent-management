import OwnerLayoutClient from "@/components/owner/OwnerLayoutClient";
import { getOwnerInfo } from "@/actions/owner";
import { redirect } from "next/navigation";

export default async function OwnerLayout({ children }) {
  const ownerInfo = await getOwnerInfo()

  if (!ownerInfo) {
    redirect('/login')
  }

  return (
    <OwnerLayoutClient ownerInfo={ownerInfo}>
      {children}
    </OwnerLayoutClient>
  );
}
