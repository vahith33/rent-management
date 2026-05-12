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
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-3 hover:bg-white rounded-full transition-colors shadow-sm border border-slate-100"
        >
          <ArrowLeft size={20} className="text-[#00685F]" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1A2B28]">Manage PG</h1>
          <p className="text-sm font-bold text-[#718096]">{pg.property_name}</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#00685F] rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-teal-900/10">
                {pg.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#1A2B28]">{pg.name}</h2>
                <div className="flex flex-col gap-1.5 text-[13px] font-bold text-[#718096]">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-[#00685F]" />
                    <span>{pg.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#EBFBF8] rounded-md flex items-center justify-center text-[10px] font-black text-[#00685F]">@</div>
                    <span className={!pg.email ? 'text-red-400 italic font-medium' : ''}>
                      {pg.email || 'No email registered'}
                    </span>
                  </div>
                </div>
                <div className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mt-2 ${pg.status === 'active' ? 'bg-[#EBFBF8] text-[#008075]' : 'bg-red-50 text-red-600'}`}>
                  {pg.status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-slate-50 pt-8">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <Building2 size={14} />
                    <span className="text-[12px] font-bold">Property & Contact</span>
                  </div>
                  <p className="font-bold text-[#1A2B28]">{pg.property_name}</p>
                  <p className="text-[13px] text-[#00685F] font-bold">{pg.email}</p>
                  <p className="text-[13px] text-[#718096]">{pg.address || 'No address set'}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <CreditCard size={14} />
                    <span className="text-[12px] font-bold">Current Plan</span>
                  </div>
                  <p className="font-bold text-[#00685F] text-lg">{pg.plan_rupee ? `₹${pg.plan_rupee}/mo` : 'Not configured'}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <CalendarDays size={14} />
                    <span className="text-[12px] font-bold">Registration</span>
                  </div>
                  <p className="font-bold text-[#1A2B28]">{new Date(pg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <User size={14} />
                    <span className="text-[12px] font-bold">Active Tenants</span>
                  </div>
                  <p className="font-black text-[#1A2B28] text-xl">{pg.tenant_count}</p>
               </div>
            </div>

            {pg.admin_notes && (
              <div className="bg-[#F8FAFB] p-6 rounded-3xl space-y-2 border border-slate-50">
                <div className="flex items-center gap-2 text-[#718096]">
                  <StickyNote size={14} />
                  <span className="text-[12px] font-bold uppercase">Admin Notes</span>
                </div>
                <p className="text-sm font-medium text-[#1A2B28] leading-relaxed">{pg.admin_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Options Column */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-black text-[#718096] uppercase tracking-widest ml-4">Quick Options</h3>
          
          <button 
            onClick={() => setIsEditOpen(true)}
            className="w-full bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 hover:border-[#00685F] transition-all group active:scale-[0.98]"
          >
            <div className="bg-emerald-50 p-3 rounded-2xl text-[#00685F] group-hover:bg-[#00685F] group-hover:text-white transition-colors">
              <Edit size={20} />
            </div>
            <div className="text-left">
              <p className="font-black text-[#1A2B28]">Edit Info</p>
              <p className="text-[11px] font-bold text-[#718096]">Update details</p>
            </div>
          </button>

          <button 
            onClick={() => setIsDisableAlertOpen(true)}
            className="w-full bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 hover:border-amber-500 transition-all group active:scale-[0.98]"
          >
            <div className={`p-3 rounded-2xl transition-colors ${pg.status === 'active' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : 'bg-emerald-50 text-[#00685F] group-hover:bg-[#00685F] group-hover:text-white'}`}>
              {pg.status === 'active' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
            </div>
            <div className="text-left">
              <p className="font-black text-[#1A2B28]">{pg.status === 'active' ? 'Disable Account' : 'Enable Account'}</p>
              <p className="text-[11px] font-bold text-[#718096]">{pg.status === 'active' ? 'Freeze login access' : 'Restore login access'}</p>
            </div>
          </button>

          <div className="pt-4">
            <button 
              onClick={() => setIsDeleteAlertOpen(true)}
              className="w-full bg-red-50 p-6 rounded-[28px] border border-red-100 shadow-sm flex items-center gap-4 hover:bg-red-600 hover:text-white transition-all group active:scale-[0.98]"
            >
              <div className="bg-red-100 p-3 rounded-2xl text-red-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Trash2 size={20} />
              </div>
              <div className="text-left">
                <p className="font-black">Delete PG</p>
                <p className="text-[11px] font-bold opacity-70 text-red-700 group-hover:text-white">Permanent removal</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <>
          <div className="fixed inset-0 bg-[#1A2B28]/20 backdrop-blur-sm z-40" onClick={() => setIsEditOpen(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFB]">
                 <h2 className="text-xl font-black text-[#1A2B28]">Edit PG Owner</h2>
                 <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-[#EEF2F8] rounded-full text-[#718096]">×</button>
               </div>
               <form onSubmit={handleEditSave} className="p-8 space-y-5">
                 <div className="space-y-1">
                   <label className="text-[12px] font-black text-[#1A2B28] ml-1">Owner Full Name</label>
                   <input required type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-[#F1F4F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-black text-[#1A2B28] ml-1">Email Address</label>
                   <input required type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-[#F1F4F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-black text-[#1A2B28] ml-1">Property Name</label>
                   <input required type="text" value={editFormData.property_name} onChange={e => setEditFormData({...editFormData, property_name: e.target.value})} className="w-full bg-[#F1F4F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-black text-[#1A2B28] ml-1">Address</label>
                   <input type="text" value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-[#F1F4F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-black text-[#1A2B28] ml-1">Plan (₹/mo)</label>
                   <input type="number" value={editFormData.plan_rupee} onChange={e => setEditFormData({...editFormData, plan_rupee: e.target.value})} className="w-full bg-[#F1F4F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-bold" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-black text-[#1A2B28] ml-1">Admin Notes</label>
                   <textarea rows={3} value={editFormData.admin_notes} onChange={e => setEditFormData({...editFormData, admin_notes: e.target.value})} className="w-full bg-[#F1F4F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-bold resize-none"></textarea>
                 </div>
                 <div className="pt-4 flex gap-4">
                   <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-white border border-slate-200 py-4 rounded-[22px] text-[#1A2B28] font-bold active:scale-95 transition-all">Cancel</button>
                   <button type="submit" disabled={isPending} className="flex-1 bg-[#00685F] py-4 rounded-[22px] text-white font-black shadow-lg shadow-teal-900/10 flex justify-center items-center gap-2 active:scale-95 transition-all">
                     {isPending ? 'Saving...' : 'Save Changes'}
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
          <div className="fixed inset-0 bg-[#1A2B28]/20 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 p-8 space-y-6 text-center">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${pg.status === 'active' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-[#00685F]'}`}>
                 {pg.status === 'active' ? <ShieldAlert size={32} /> : <CheckCircle size={32} />}
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#1A2B28]">{pg.status === 'active' ? 'Disable' : 'Enable'} {pg.name}?</h2>
                 <p className="text-sm font-medium text-[#718096] mt-3">
                   {pg.status === 'active' 
                     ? 'This will prevent the owner from logging in until re-enabled.' 
                     : 'This will restore full access for the owner.'}
                 </p>
               </div>
               <div className="flex gap-4 pt-2">
                 <button onClick={() => setIsDisableAlertOpen(false)} className="flex-1 bg-slate-100 py-4 rounded-[22px] text-[#1A2B28] font-bold">Cancel</button>
                 <button onClick={handleToggleStatus} className={`flex-1 py-4 rounded-[22px] text-white font-black shadow-lg active:scale-95 transition-all ${pg.status === 'active' ? 'bg-amber-600 shadow-amber-600/20' : 'bg-[#00685F] shadow-teal-900/20'}`}>
                   {isPending ? 'Updating...' : `Yes, ${pg.status === 'active' ? 'Disable' : 'Enable'}`}
                 </button>
               </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Alert */}
      {isDeleteAlertOpen && (
        <>
          <div className="fixed inset-0 bg-[#1A2B28]/30 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 p-8 space-y-6 text-center">
               <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                 <Trash2 size={32} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#1A2B28]">Permanent Delete?</h2>
                 <p className="text-sm font-medium text-[#718096] mt-4 leading-relaxed">
                   Are you absolutely sure you want to delete <strong className="text-[#1A2B28]">{pg.property_name}</strong>? All associated data including rooms, tenants, and history will be lost forever.
                 </p>
               </div>
               <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsDeleteAlertOpen(false)} className="flex-1 bg-slate-100 py-4 rounded-[22px] text-[#1A2B28] font-bold">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 bg-red-600 py-4 rounded-[22px] text-white font-black shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                   {isPending ? 'Deleting...' : 'Delete Forever'}
                 </button>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
