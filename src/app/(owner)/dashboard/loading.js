export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans animate-pulse">
      <main className="px-6 pt-8 space-y-8">
        
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-32"></div>
        </div>

        {/* KPI Cards Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 h-28 shadow-sm">
              <div className="h-3 bg-slate-100 rounded w-16 mb-4"></div>
              <div className="h-8 bg-slate-100 rounded w-12"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
              <div className="h-2.5 bg-slate-200 rounded w-12"></div>
            </div>
          ))}
        </div>

        {/* Rent Status Section Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded-lg w-32"></div>
            <div className="h-4 bg-slate-200 rounded w-12"></div>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-200 rounded-full w-24"></div>
            ))}
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-[28px] border border-slate-50 h-20 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-32"></div>
                    <div className="h-3 bg-slate-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
