export default function SupportLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans animate-pulse">
      <main className="px-6 pt-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-3 mb-10">
          <div className="h-9 bg-slate-200 rounded-lg w-56"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-64"></div>
        </div>

        {/* Contact Cards Skeleton */}
        <div className="grid gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full bg-white p-7 rounded-[32px] border border-slate-50 flex items-center gap-6 h-28 shadow-sm">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-100 rounded w-40"></div>
                <div className="h-3 bg-slate-100 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="h-6 bg-slate-200 rounded w-48 ml-2"></div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 h-20 shadow-sm">
              <div className="h-4 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
