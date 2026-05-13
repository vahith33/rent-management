'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { togglePGStatus, updatePG, deletePG } from '@/actions/admin'
import { 
  ShieldAlert, 
  CheckCircle, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  User, 
  Building2, 
  CreditCard, 
  StickyNote,
  Smartphone,
  CalendarDays
} from 'lucide-react'

export default function ManagePGClient({ pg }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDisableAlertOpen, setIsDisableAlertOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  // Edit form state
  const [editFormData, setEditFormData] = useState({ 
    name: pg.name || '', 
    email: pg.email || '',
    property_name: pg.property_name || '', 
    address: pg.address || '', 
    plan_rupee: pg.plan_rupee || '', 
    admin_notes: pg.admin_notes || '' 
  })

  const handleToggleStatus = async () => {
    startTransition(async () => {
      await togglePGStatus(pg.id, pg.status)
      setIsDisableAlertOpen(false)
      router.refresh()
    })
  }

  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deletePG(pg.id)
      if (res.success) {
        router.push('/admin/dashboard')
      }
    })
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    startTransition(async () => {
      const formData = new FormData()
      formData.append('name', editFormData.name)
      formData.append('email', editFormData.email)
      formData.append('property_name', editFormData.property_name)
      formData.append('address', editFormData.address)
      formData.append('plan_rupee', editFormData.plan_rupee)
      formData.append('admin_notes', editFormData.admin_notes)

      const res = await updatePG(pg.id, formData)
      if (res.success) {
        setIsEditOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-body pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all text-[#00685F]"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-[17px] font-black text-[#1A2B28] leading-tight">Manage PG</h1>
          <p className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">{pg.property_name}</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 pb-0">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#00685F] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-teal-900/10">
                  {pg.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1A2B28]">{pg.name}</h2>
                  <div className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider mt-1.5 ${pg.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {pg.status}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsEditOpen(true)}
                className="w-10 h-10 bg-[#EBFBF8] text-[#00685F] rounded-xl flex items-center justify-center active:scale-95 transition-all"
              >
                <Edit size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#1A2B28]">
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Smartphone size={16} />
                </div>
                <span className="text-[15px] font-bold">{pg.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#1A2B28]">
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <div className="text-[12px] font-black">@</div>
                </div>
                <span className="text-[15px] font-bold">{pg.email}</span>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4 mt-4 border-t border-slate-50 bg-[#F8FAFB]/50">
             <div className="bg-white p-4 rounded-2xl border border-slate-100/50 shadow-sm">
                <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest block mb-1">Monthly Plan</span>
                <p className="text-[16px] font-black text-[#00685F]">{pg.plan_rupee ? `₹${pg.plan_rupee}` : 'Free'}</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-100/50 shadow-sm">
                <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest block mb-1">Active Tenants</span>
                <p className="text-[16px] font-black text-[#1A2B28]">{pg.tenant_count}</p>
             </div>
             <div className="col-span-2 bg-white p-4 rounded-2xl border border-slate-100/50 shadow-sm">
                <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest block mb-1">Property Address</span>
                <p className="text-[14px] font-bold text-[#1A2B28]">{pg.address || 'No address provided'}</p>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-[0.2em] ml-2">Quick Actions</p>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsDisableAlertOpen(true)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-3 active:scale-[0.98] transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${pg.status === 'active' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {pg.status === 'active' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
              </div>
              <span className="text-[13px] font-black text-[#1A2B28]">{pg.status === 'active' ? 'Disable' : 'Enable'}</span>
            </button>

            <button 
              onClick={() => setIsDeleteAlertOpen(true)}
              className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center gap-3 active:scale-[0.98] transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl text-red-500 flex items-center justify-center shadow-sm">
                <Trash2 size={20} />
              </div>
              <span className="text-[13px] font-black text-red-600">Delete</span>
            </button>
          </div>
        </div>

        {pg.admin_notes && (
          <div className="bg-[#EEF2F8] p-6 rounded-[32px] space-y-2 border border-blue-100/50">
            <div className="flex items-center gap-2 text-[#718096]">
              <StickyNote size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Admin Notes</span>
            </div>
            <p className="text-[13px] font-bold text-[#1A2B28] leading-relaxed">{pg.admin_notes}</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-[#1A2B28]/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFB]">
               <h2 className="text-lg font-black text-[#1A2B28]">Edit PG Owner</h2>
               <button onClick={() => setIsEditOpen(false)} className="text-2xl font-light text-[#718096]">×</button>
             </div>
             <form onSubmit={handleEditSave} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Owner Name</label>
                 <input required type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-[15px] font-bold focus:ring-2 focus:ring-[#00685F]/20 transition-all" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Email</label>
                 <input required type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-[15px] font-bold focus:ring-2 focus:ring-[#00685F]/20 transition-all" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Property Name</label>
                 <input required type="text" value={editFormData.property_name} onChange={e => setEditFormData({...editFormData, property_name: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-[15px] font-bold focus:ring-2 focus:ring-[#00685F]/20 transition-all" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Plan (₹)</label>
                   <input type="number" value={editFormData.plan_rupee} onChange={e => setEditFormData({...editFormData, plan_rupee: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-[15px] font-bold" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Address</label>
                   <input type="text" value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-[15px] font-bold" />
                 </div>
               </div>
               <div className="pt-4 flex gap-3">
                 <button type="submit" disabled={isPending} className="flex-1 bg-[#00685F] py-4.5 rounded-2xl text-white font-black shadow-xl shadow-teal-900/10 flex justify-center items-center gap-2 active:scale-95 transition-all">
                   {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Disable Alert */}
      {isDisableAlertOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#1A2B28]/40 backdrop-blur-sm" onClick={() => setIsDisableAlertOpen(false)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 p-10 space-y-6 text-center">
             <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto ${pg.status === 'active' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
               {pg.status === 'active' ? <ShieldAlert size={32} /> : <CheckCircle size={32} />}
             </div>
             <div>
               <h2 className="text-xl font-black text-[#1A2B28]">{pg.status === 'active' ? 'Disable' : 'Enable'}?</h2>
               <p className="text-[13px] font-bold text-[#718096] mt-2">
                 {pg.status === 'active' ? 'This will freeze login access immediately.' : 'This will restore full access.'}
               </p>
             </div>
             <div className="flex gap-3 pt-2">
               <button onClick={handleToggleStatus} className={`flex-1 py-4.5 rounded-2xl text-white font-black shadow-xl active:scale-95 transition-all ${pg.status === 'active' ? 'bg-orange-500 shadow-orange-900/20' : 'bg-[#00685F] shadow-teal-900/20'}`}>
                 {isPending ? '...' : 'Confirm'}
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Delete Alert */}
      {isDeleteAlertOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#1A2B28]/50 backdrop-blur-sm" onClick={() => setIsDeleteAlertOpen(false)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 p-10 space-y-6 text-center">
             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mx-auto">
               <Trash2 size={32} />
             </div>
             <div>
               <h2 className="text-xl font-black text-[#1A2B28]">Permanent Delete?</h2>
               <p className="text-[13px] font-bold text-[#718096] mt-2">All data for {pg.property_name} will be erased forever.</p>
             </div>
             <button onClick={handleDelete} className="w-full bg-red-500 py-4.5 rounded-2xl text-white font-black shadow-xl shadow-red-900/20 active:scale-95 transition-all">
               {isPending ? '...' : 'Delete Forever'}
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
