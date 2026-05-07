export default function TenantsLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans animate-pulse">
      <main className="px-6 pt-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="h-9 bg-slate-200 rounded-lg w-56"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-40"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-16 bg-white rounded-[24px] border border-slate-200 w-full shadow-sm"></div>

        {/* List Section Skeleton */}
        <div className="space-y-4">
          <div className="h-7 bg-slate-200 rounded-lg w-48 mb-6"></div>
          
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4 h-36">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-100 rounded-2xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-32"></div>
                      <div className="h-3 bg-slate-100 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-3 pt-3 border-t border-slate-50">
                  <div className="h-6 bg-slate-50 rounded w-12"></div>
                  <div className="h-6 bg-slate-50 rounded w-12 mx-auto"></div>
                  <div className="h-6 bg-slate-50 rounded w-16 ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
