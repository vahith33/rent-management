export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] font-body flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 sticky top-0">
        <div className="w-40 h-7 bg-slate-200 rounded-md animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-5 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="w-20 h-9 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8">
        <div className="w-64 h-10 bg-slate-200 rounded-md animate-pulse"></div>
        <div className="flex border-b border-slate-200 gap-4 pb-2">
          <div className="w-24 h-6 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="w-24 h-6 bg-slate-200 rounded-md animate-pulse"></div>
          <div className="w-24 h-6 bg-slate-200 rounded-md animate-pulse"></div>
        </div>
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
               <div className="flex-1 h-6 bg-slate-100 rounded-md animate-pulse"></div>
               <div className="flex-1 h-6 bg-slate-100 rounded-md animate-pulse"></div>
               <div className="flex-1 h-6 bg-slate-100 rounded-md animate-pulse"></div>
               <div className="w-24 h-6 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
