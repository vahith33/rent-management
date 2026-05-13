'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { togglePGStatus, updatePG } from '../../actions/admin'
import { MoreHorizontal, ShieldAlert, CheckCircle, Edit, Eye, ShieldBan } from 'lucide-react'

// Simple mock for Toast
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

export default function ViewAllPGs({ initialData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [toast, setToast] = useState(null)
  const [selectedOwner, setSelectedOwner] = useState(null)
  
  // Modals state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDisableAlertOpen, setIsDisableAlertOpen] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState(null)

  // Edit form state
  const [editFormData, setEditFormData] = useState({ name: '', property_name: '', address: '', plan_rupee: '', admin_notes: '' })
  
  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAction = async (action) => {
    const result = await action()
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast('Action successful', 'success')
      startTransition(() => {
        router.refresh()
      })
    }
    return result
  }

  const handleToggleStatus = async (id, currentStatus) => {
    await handleAction(() => togglePGStatus(id, currentStatus))
    setIsDisableAlertOpen(false)
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!selectedOwner) return

    const formData = new FormData()
    formData.append('name', editFormData.name)
    formData.append('property_name', editFormData.property_name)
    formData.append('address', editFormData.address)
    formData.append('plan_rupee', editFormData.plan_rupee)
    formData.append('admin_notes', editFormData.admin_notes)

    const res = await handleAction(() => updatePG(selectedOwner.id, formData))
    if (res.success) {
      setIsEditOpen(false)
    }
  }

  const openEdit = (owner) => {
    setSelectedOwner(owner)
    setEditFormData({
      name: owner.name || '',
      property_name: owner.property_name || '',
      address: owner.address || '',
      plan_rupee: owner.plan_rupee || '',
      admin_notes: owner.admin_notes || ''
    })
    setIsEditOpen(true)
  }

  if (!initialData || initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-[#EEF2F8] rounded-full flex items-center justify-center text-[#718096] mb-4">
          <ShieldAlert size={24} />
        </div>
        <h3 className="text-xl font-black text-[#1A2B28]">No PGs registered yet</h3>
        <p className="text-sm font-medium text-[#718096] mt-2 mb-6">Add your first PG to start managing.</p>
        <button 
          onClick={() => router.push('/admin/dashboard?tab=add')}
          className="bg-[#00685F] text-white px-6 py-3 rounded-[20px] font-bold active:scale-95 transition-all shadow-lg shadow-teal-900/10"
        >
          Add New PG
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] overflow-visible shadow-sm border border-slate-100">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFB] text-[#718096] font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Owner Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Mobile Number</th>
                <th className="px-6 py-4 text-center">Tenants</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Reg Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[#1A2B28] font-medium">
              {initialData.map((owner) => (
                <tr key={owner.id} className="hover:bg-[#F8FAFB]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold">{owner.name}</div>
                    <div className="text-[11px] text-[#718096] font-medium">{owner.property_name}</div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#718096] font-medium">{owner.email}</td>
                  <td className="px-6 py-4">{(owner.phone || '').replace(/(\d{5})(\d{5})/, '$1 $2')}</td>
                  <td className="px-6 py-4 text-center font-bold">{owner.tenant_count}</td>
                  <td className="px-6 py-4">{owner.plan_rupee ? `₹${owner.plan_rupee}/mo` : <span className="text-[#ADB5BD]">Not set</span>}</td>
                  <td className="px-6 py-4 text-[#718096] text-[12px]">{new Date(owner.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${owner.status === 'active' ? 'bg-[#EBFBF8] text-[#008075]' : 'bg-red-50 text-red-600'}`}>
                      {owner.status === 'active' ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => router.push(`/admin/pg/${owner.id}`)}
                      className="inline-flex items-center gap-2 bg-[#EEF2F8] text-[#00685F] px-4 py-2 rounded-xl font-bold text-[12px] hover:bg-[#00685F] hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                      <Eye size={14} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sheet (Side Panel) */}
      {isSheetOpen && selectedOwner && (
        <>
          <div className="fixed inset-0 bg-[#1A2B28]/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSheetOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFB]">
              <h2 className="text-xl font-black text-[#1A2B28]">PG Details</h2>
              <button onClick={() => setIsSheetOpen(false)} className="p-2 hover:bg-[#EEF2F8] rounded-full text-[#718096]">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Owner Name</p><p className="font-bold text-[#1A2B28] text-base">{selectedOwner.name}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Email Address</p><p className="font-bold text-[#1A2B28] text-base">{selectedOwner.email}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Mobile Number</p><p className="font-bold text-[#1A2B28] text-base">{selectedOwner.phone}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Property Name</p><p className="font-bold text-[#1A2B28] text-base">{selectedOwner.property_name}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Property Address</p><p className="font-medium text-[#1A2B28]">{selectedOwner.address || '—'}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Plan</p><p className="font-bold text-[#00685F] text-base">{selectedOwner.plan_rupee ? `₹${selectedOwner.plan_rupee}/mo` : 'Not set'}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Admin Notes</p><p className="font-medium text-[#1A2B28] bg-[#EEF2F8] p-4 rounded-2xl">{selectedOwner.admin_notes || 'No notes.'}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Registration Date</p><p className="font-medium text-[#1A2B28]">{new Date(selectedOwner.created_at).toLocaleString()}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Current Status</p><p className="font-bold text-[#1A2B28]">{selectedOwner.status}</p></div>
               <div className="space-y-1"><p className="text-[12px] font-bold text-[#718096]">Number of Active Tenants</p><p className="font-black text-[#1A2B28] text-xl">{selectedOwner.tenant_count}</p></div>
            </div>
          </div>
        </>
      )}

      {/* Dialog (Edit Form) */}
      {isEditOpen && selectedOwner && (
        <>
          <div className="fixed inset-0 bg-[#1A2B28]/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsEditOpen(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFB]">
                 <h2 className="text-xl font-black text-[#1A2B28]">Edit PG Owner</h2>
                 <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-[#EEF2F8] rounded-full text-[#718096]">×</button>
               </div>
               <form onSubmit={handleEditSave} className="p-6 space-y-4">
                 <div className="space-y-1">
                   <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Owner Full Name</label>
                   <input required type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Mobile Number</label>
                   <div className="flex items-center gap-3 bg-slate-50 border-none rounded-2xl p-4 text-[#718096] text-sm font-medium">
                     <ShieldBan size={16} className="text-[#ADB5BD]" />
                     <span className="flex-1 cursor-not-allowed">{selectedOwner.phone}</span>
                   </div>
                   <p className="text-[10px] font-bold text-[#ADB5BD] ml-1 mt-1">Cannot change — this is the owner's login number</p>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Property Name</label>
                   <input required type="text" value={editFormData.property_name} onChange={e => setEditFormData({...editFormData, property_name: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Property Address (optional)</label>
                   <input type="text" value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Plan (₹/month) (optional)</label>
                   <input type="number" value={editFormData.plan_rupee} onChange={e => setEditFormData({...editFormData, plan_rupee: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[12px] font-bold text-[#1A2B28] ml-1">Admin Notes (optional)</label>
                   <textarea rows={3} value={editFormData.admin_notes} onChange={e => setEditFormData({...editFormData, admin_notes: e.target.value})} className="w-full bg-[#EEF2F8] border-none rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium"></textarea>
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-white border border-slate-200 py-4 rounded-[20px] text-[#1A2B28] font-bold">Cancel</button>
                   <button type="submit" disabled={isPending} className="flex-1 bg-[#00685F] py-4 rounded-[20px] text-white font-black shadow-lg shadow-teal-900/10 flex justify-center items-center gap-2 active:scale-95 transition-transform disabled:opacity-70">
                     {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
                   </button>
                 </div>
               </form>
            </div>
          </div>
        </>
      )}

      {/* AlertDialog (Disable) */}
      {isDisableAlertOpen && selectedOwner && (
        <>
          <div className="fixed inset-0 bg-[#1A2B28]/20 backdrop-blur-sm z-40 transition-opacity"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 p-6 space-y-5 text-center">
               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                 <ShieldAlert size={28} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-[#1A2B28]">Disable {selectedOwner.name}?</h2>
                 <p className="text-sm font-medium text-[#718096] mt-2">They will not be able to log in until re-enabled.</p>
               </div>
               <div className="flex gap-3 pt-2">
                 <button onClick={() => setIsDisableAlertOpen(false)} className="flex-1 bg-slate-100 py-3 rounded-2xl text-[#1A2B28] font-bold">Cancel</button>
                 <button disabled={isPending} onClick={() => handleToggleStatus(selectedOwner.id, 'active')} className="flex-1 bg-red-600 py-3 rounded-2xl text-white font-black shadow-lg shadow-red-600/20 active:scale-95 transition-transform disabled:opacity-70 flex justify-center items-center">
                   {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Yes, Disable'}
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
