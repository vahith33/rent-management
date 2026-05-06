import BottomNav from "@/components/BottomNav";

export default function OwnerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {children}
      <BottomNav />
    </div>
  );
}
