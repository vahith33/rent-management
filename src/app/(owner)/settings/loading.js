export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24 font-sans animate-pulse">
      <main className="px-6 pt-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-3 mb-10">
          <div className="h-9 bg-slate-200 rounded-lg w-40"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-56"></div>
        </div>

        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-[32px] p-8 flex flex-col items-center text-center shadow-sm border border-slate-50 relative overflow-hidden">
          <div className="w-24 h-24 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>

        {/* Form Sections Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-5 bg-slate-200 rounded w-24 ml-2"></div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 h-24 shadow-sm">
                <div className="h-3 bg-slate-100 rounded w-16 mb-3"></div>
                <div className="h-5 bg-slate-100 rounded w-48"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-14 bg-slate-200 rounded-[20px]"></div>
          <div className="h-14 bg-slate-200 rounded-[20px]"></div>
        </div>

      </main>
    </div>
  );
}
