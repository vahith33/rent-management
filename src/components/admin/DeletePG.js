'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePG } from '../../actions/admin'
import { ShieldAlert, Trash2, CheckCircle } from 'lucide-react'

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border text-sm font-bold z-50 flex items-center gap-3 animate-in slide-in-from-bottom-5 ${type === 'success' ? 'bg-white border-[#00685F] text-[#00685F]' : 'bg-white border-red-500 text-red-600'}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
      {message}
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100">×</button>
    </div>
  )
}

export default function DeletePG({ initialData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedOwner, setSelectedOwner] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDelete = async () => {
    if (!selectedOwner) return
    startTransition(async () => {
      const result = await deletePG(selectedOwner.id)
      if (result.error) {
        showToast('Failed to delete. Please try again.', 'error')
      } else {
        showToast(`${selectedOwner.property_name} has been permanently deleted.`, 'success')
        setSelectedOwner(null)
        router.refresh()
      }
    })
  }

  if (!initialData || initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-[#EEF2F8] rounded-full flex items-center justify-center text-[#718096] mb-4">
          <Trash2 size={24} />
        </div>
        <h3 className="text-xl font-black text-[#1A2B28]">No PGs to delete</h3>
        <p className="text-sm font-medium text-[#718096] mt-2 mb-6">There are no registered PGs in the system.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {initialData.map((owner) => (
        <div key={owner.id} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-black text-[#1A2B28]">{owner.name}</h3>
            <p className="text-sm font-bold text-[#718096]">{owner.property_name}</p>
            <p className="text-[13px] font-medium text-[#ADB5BD]">{owner.phone}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-1 bg-[#EEF2F8] text-[#718096] rounded-full text-[10px] font-bold">
                {owner.tenant_count} tenants
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${owner.status === 'active' ? 'bg-[#EBFBF8] text-[#008075]' : 'bg-red-50 text-red-600'}`}>
                {owner.status === 'active' ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
          <div>
            <button 
              onClick={() => setSelectedOwner(owner)}
              className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors active:scale-95 shadow-sm border border-red-100 flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}

      {/* AlertDialog (Delete) */}
      {selectedOwner && (
        <>
          <div className="fixed inset-0 bg-[#1A2B28]/30 backdrop-blur-sm z-40 transition-opacity"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 p-6 space-y-5 text-center">
               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                 <ShieldAlert size={28} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-[#1A2B28] leading-tight">Delete {selectedOwner.property_name}?</h2>
                 <p className="text-sm font-medium text-[#718096] mt-3 leading-relaxed">
                   This will permanently delete <strong className="text-[#1A2B28]">{selectedOwner.name}</strong> and ALL their data including <strong className="text-red-600">{selectedOwner.tenant_count} tenants</strong>, all rooms, rent records, and maintenance requests. This cannot be undone.
                 </p>
               </div>
               <div className="flex gap-3 pt-4">
                 <button disabled={isPending} onClick={() => setSelectedOwner(null)} className="flex-1 bg-slate-100 py-3.5 rounded-[20px] text-[#1A2B28] font-bold">Cancel</button>
                 <button disabled={isPending} onClick={handleDelete} className="flex-1 bg-red-600 py-3.5 rounded-[20px] text-white font-black shadow-lg shadow-red-600/20 active:scale-95 transition-transform disabled:opacity-70 flex justify-center items-center">
                   {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Yes, Delete Permanently'}
                 </button>
               </div>
            </div>
          </div>
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
