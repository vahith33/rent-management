export default function RoomsLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans animate-pulse">
      <main className="px-6 pt-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="h-9 bg-slate-200 rounded-lg w-60"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-48"></div>
        </div>

        {/* Menu Cards Skeleton */}
        <div className="grid gap-5 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full bg-white p-7 rounded-[32px] border border-slate-50 flex items-center gap-6 h-28 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-6 bg-slate-100 rounded w-32"></div>
                <div className="h-3 bg-slate-100 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
