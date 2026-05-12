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
    <div className="min-h-screen bg-[#F8FAFB] font-body">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 pb-32">
        {/* Header */}
        <header className="flex items-center gap-5">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={22} className="text-[#00685F]" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#1A2B28] tracking-tight">Manage PG</h1>
            <p className="text-[14px] font-medium text-[#718096]">{pg.property_name}</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-[#00685F] rounded-[28px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-teal-900/10 transition-transform hover:scale-105">
                  {pg.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1A2B28]">{pg.name}</h2>
                  <div className="flex flex-col gap-1.5 text-[14px] font-medium text-[#718096]">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-[#008075]" />
                      <span className="font-bold">{pg.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#EBFBF8] rounded-md flex items-center justify-center text-[10px] font-black text-[#008075]">@</div>
                      <span className={!pg.email ? 'text-red-400 italic' : 'font-bold text-[#1A2B28]'}>
                        {pg.email || 'No email registered'}
                      </span>
                    </div>
                  </div>
                  <div className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] mt-2 ${pg.status === 'active' ? 'bg-[#EBFBF8] text-[#008075]' : 'bg-red-50 text-[#EF4444]'}`}>
                    {pg.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-10 border-t border-slate-50 pt-10">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#ADB5BD]">
                      <Building2 size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Property & Contact</span>
                    </div>
                    <p className="text-[16px] font-bold text-[#1A2B28]">{pg.property_name}</p>
                    <p className="text-[14px] text-[#718096] leading-relaxed">{pg.address || 'No address set'}</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#ADB5BD]">
                      <CreditCard size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Current Plan</span>
                    </div>
                    <p className="text-[22px] font-black text-[#00685F]">{pg.plan_rupee ? `₹${pg.plan_rupee}/mo` : 'Not configured'}</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#ADB5BD]">
                      <CalendarDays size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Registration</span>
                    </div>
                    <p className="text-[16px] font-bold text-[#1A2B28]">{new Date(pg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#ADB5BD]">
                      <User size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Active Tenants</span>
                    </div>
                    <p className="text-[30px] font-black text-[#1A2B28] leading-none">{pg.tenant_count}</p>
                 </div>
              </div>

              {pg.admin_notes && (
                <div className="bg-[#EEF2F8]/50 p-6 rounded-[28px] space-y-3 border border-slate-50">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <StickyNote size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Admin Notes</span>
                  </div>
                  <p className="text-[14px] font-medium text-[#1A2B28] leading-relaxed">{pg.admin_notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Options Column */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-[0.2em] ml-4">Quick Options</h3>
            
            <button 
              onClick={() => setIsEditOpen(true)}
              className="w-full bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl hover:scale-[1.02] hover:border-[#00685F]/30 transition-all duration-300 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-[#EBFBF8] rounded-2xl text-[#00685F] flex items-center justify-center group-hover:bg-[#00685F] group-hover:text-white transition-colors">
                <Edit size={24} />
              </div>
              <div className="text-left">
                <p className="text-[16px] font-black text-[#1A2B28]">Edit Info</p>
                <p className="text-[12px] font-bold text-[#718096]">Update owner details</p>
              </div>
            </button>

            <button 
              onClick={() => setIsDisableAlertOpen(true)}
              className="w-full bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group active:scale-[0.98]"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${pg.status === 'active' ? 'bg-orange-50 text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white' : 'bg-[#EBFBF8] text-[#008075] group-hover:bg-[#008075] group-hover:text-white'}`}>
                {pg.status === 'active' ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
              </div>
              <div className="text-left">
                <p className="text-[16px] font-black text-[#1A2B28]">{pg.status === 'active' ? 'Disable Account' : 'Enable Account'}</p>
                <p className="text-[12px] font-bold text-[#718096]">{pg.status === 'active' ? 'Freeze login access' : 'Restore login access'}</p>
              </div>
            </button>

            <div className="pt-6">
              <button 
                onClick={() => setIsDeleteAlertOpen(true)}
                className="w-full bg-red-50/50 p-6 rounded-[28px] border border-red-100 shadow-sm flex items-center gap-5 hover:bg-[#EF4444] hover:text-white transition-all duration-300 group active:scale-[0.98]"
              >
                <div className="w-14 h-14 bg-[#FEF2F2] rounded-2xl text-[#EF4444] flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <Trash2 size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[16px] font-black">Delete PG</p>
                  <p className="text-[12px] font-bold opacity-70">Permanent removal</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditOpen && (
          <>
            <div className="fixed inset-0 bg-[#1A2B28]/40 backdrop-blur-md z-40 transition-all duration-500" onClick={() => setIsEditOpen(false)}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                 <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFB]">
                   <h2 className="text-xl font-black text-[#1A2B28]">Edit PG Owner</h2>
                   <button onClick={() => setIsEditOpen(false)} className="w-10 h-10 hover:bg-[#EEF2F8] rounded-full text-[#718096] flex items-center justify-center transition-colors">×</button>
                 </div>
                 <form onSubmit={handleEditSave} className="p-8 space-y-6">
                   <div className="space-y-2">
                     <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Owner Full Name</label>
                     <input required type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-[20px] p-5 text-[#1A2B28] outline-none text-[15px] font-bold focus:ring-2 focus:ring-[#00685F]/20 transition-all" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Email Address</label>
                     <input required type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-[20px] p-5 text-[#1A2B28] outline-none text-[15px] font-bold focus:ring-2 focus:ring-[#00685F]/20 transition-all" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Property Name</label>
                     <input required type="text" value={editFormData.property_name} onChange={e => setEditFormData({...editFormData, property_name: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-[20px] p-5 text-[#1A2B28] outline-none text-[15px] font-bold focus:ring-2 focus:ring-[#00685F]/20 transition-all" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Plan (₹/mo)</label>
                       <input type="number" value={editFormData.plan_rupee} onChange={e => setEditFormData({...editFormData, plan_rupee: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-[20px] p-5 text-[#1A2B28] outline-none text-[15px] font-bold" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-widest ml-1">Address</label>
                       <input type="text" value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-[20px] p-5 text-[#1A2B28] outline-none text-[15px] font-bold" />
                     </div>
                   </div>
                   <div className="pt-6 flex gap-4">
                     <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-[#F8FAFB] py-5 rounded-[20px] text-[#718096] font-bold active:scale-95 transition-all">Cancel</button>
                     <button type="submit" disabled={isPending} className="flex-1 bg-[#00685F] py-5 rounded-[20px] text-white font-black shadow-xl shadow-teal-900/10 flex justify-center items-center gap-2 active:scale-95 transition-all">
                       {isPending ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
                     </button>
                   </div>
                 </form>
              </div>
            </div>
          </>
        )}

        {/* Disable Alert */}
        {isDisableAlertOpen && (
          <>
            <div className="fixed inset-0 bg-[#1A2B28]/40 backdrop-blur-md z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 p-10 space-y-8 text-center">
                 <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto ${pg.status === 'active' ? 'bg-orange-50 text-[#EA580C]' : 'bg-[#EBFBF8] text-[#00685F]'}`}>
                   {pg.status === 'active' ? <ShieldAlert size={40} /> : <CheckCircle size={40} />}
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-[#1A2B28]">{pg.status === 'active' ? 'Disable' : 'Enable'} Account?</h2>
                   <p className="text-[14px] font-medium text-[#718096] mt-3 leading-relaxed">
                     {pg.status === 'active' 
                       ? `This will freeze login access for ${pg.name} immediately.` 
                       : `This will restore full access for ${pg.name}.`}
                   </p>
                 </div>
                 <div className="flex gap-4 pt-2">
                   <button onClick={() => setIsDisableAlertOpen(false)} className="flex-1 bg-[#F8FAFB] py-5 rounded-[20px] text-[#718096] font-bold active:scale-95 transition-all">Cancel</button>
                   <button onClick={handleToggleStatus} className={`flex-1 py-5 rounded-[20px] text-white font-black shadow-xl active:scale-95 transition-all ${pg.status === 'active' ? 'bg-[#EA580C] shadow-orange-900/20' : 'bg-[#00685F] shadow-teal-900/20'}`}>
                     {isPending ? 'Updating...' : 'Confirm'}
                   </button>
                 </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Alert */}
        {isDeleteAlertOpen && (
          <>
            <div className="fixed inset-0 bg-[#1A2B28]/50 backdrop-blur-md z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 p-10 space-y-8 text-center">
                 <div className="w-24 h-24 bg-[#FEF2F2] text-[#EF4444] rounded-[32px] flex items-center justify-center mx-auto">
                   <Trash2 size={40} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-[#1A2B28]">Permanent Delete?</h2>
                   <p className="text-[14px] font-medium text-[#718096] mt-4 leading-relaxed">
                     This action cannot be undone. All data for <strong className="text-[#1A2B28]">{pg.property_name}</strong> will be erased from the system forever.
                   </p>
                 </div>
                 <div className="flex gap-4 pt-4">
                   <button onClick={() => setIsDeleteAlertOpen(false)} className="flex-1 bg-[#F8FAFB] py-5 rounded-[20px] text-[#718096] font-bold active:scale-95 transition-all">Cancel</button>
                   <button onClick={handleDelete} className="flex-1 bg-[#EF4444] py-5 rounded-[20px] text-white font-black shadow-xl shadow-red-900/20 active:scale-95 transition-all">
                     {isPending ? 'Deleting...' : 'Delete Forever'}
                   </button>
                 </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
