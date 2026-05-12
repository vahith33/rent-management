'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addPG } from '../../actions/admin'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function AddNewPG() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [isSuccess, setIsSuccess] = useState(false)
  const [newOwnerData, setNewOwnerData] = useState(null)
  
  const [formError, setFormError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_name: '',
    address: '',
    plan_rupee: '',
    admin_notes: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
    if (formError) setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const errors = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email || !formData.email.includes('@')) errors.email = "Enter a valid email address"
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) errors.phone = "Enter a valid 10-digit mobile number"
    if (!formData.property_name.trim()) errors.property_name = "Property name is required"

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const data = new FormData()
    Object.entries(formData).forEach(([key, val]) => data.append(key, val))

    startTransition(async () => {
      const result = await addPG(data)
      
      if (result.error === 'validation') {
        setFieldErrors(result.fields || {})
      } else if (result.error === 'email_exists') {
        setFieldErrors({ email: result.message || 'Email exists' })
      } else if (result.error === 'phone_exists') {
        setFieldErrors({ phone: result.message || 'Phone exists' })
      } else if (result.error) {
        setFormError(result.message || 'An unexpected error occurred.')
      } else if (result.success) {
        setNewOwnerData({ name: formData.name, property: formData.property_name })
        setIsSuccess(true)
      }
    })
  }

  if (isSuccess && newOwnerData) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm text-center animate-in zoom-in-95 space-y-6">
        <div className="w-20 h-20 bg-[#EBFBF8] text-[#00685F] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={36} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#1A2B28]">PG Registered Successfully!</h2>
          <p className="text-[#718096] font-medium mt-2">
            <strong className="text-[#1A2B28]">{newOwnerData.name}</strong> is now managing <strong className="text-[#1A2B28]">{newOwnerData.property}</strong>.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={() => {
              setIsSuccess(false)
              setFormData({ name: '', email: '', phone: '', property_name: '', address: '', plan_rupee: '', admin_notes: '' })
            }}
            className="px-6 py-4 rounded-2xl font-bold text-[#1A2B28] bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Add Another PG
          </button>
          <button 
            onClick={() => {
              const params = new URLSearchParams(window.location.search); 
              params.set('tab', 'view'); 
              router.push(`?${params.toString()}`) 
              router.refresh()
            }}
            className="px-6 py-4 rounded-2xl font-black text-white bg-[#00685F] shadow-lg shadow-teal-900/10 hover:scale-95 transition-transform"
          >
            View All PGs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
      <h2 className="text-xl font-black text-[#1A2B28] mb-6">Register New PG</h2>
      
      {formError && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Owner Full Name</label>
            <input 
              type="text" name="name" disabled={isPending}
              placeholder="e.g. Suresh Kumar" value={formData.name} onChange={handleChange}
              className={`w-full bg-[#EEF2F8] border-2 rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium transition-colors ${fieldErrors.name ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[#008075]/30'}`}
            />
            {fieldErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1">{fieldErrors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Email Address</label>
            <input 
              type="email" name="email" disabled={isPending}
              placeholder="suresh@example.com" value={formData.email} onChange={handleChange}
              className={`w-full bg-[#EEF2F8] border-2 rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium transition-colors ${fieldErrors.email ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[#008075]/30'}`}
            />
            {fieldErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1">{fieldErrors.email}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Mobile Number</label>
          <div className={`flex items-center bg-[#EEF2F8] border-2 rounded-2xl transition-colors ${fieldErrors.phone ? 'border-red-400 focus-within:border-red-500' : 'border-transparent focus-within:border-[#008075]/30'}`}>
            <span className="pl-4 pr-2 font-bold text-[#718096]">+91</span>
            <input 
              type="text" name="phone" disabled={isPending} maxLength={10}
              placeholder="98765 43210" value={formData.phone} onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                handleChange({ target: { name: 'phone', value: val } })
              }}
              className="w-full bg-transparent border-none py-4 pr-4 text-[#1A2B28] outline-none text-sm font-medium"
            />
          </div>
          {fieldErrors.phone && <p className="text-[11px] font-bold text-red-500 ml-1">{fieldErrors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Property Name</label>
          <input 
            type="text" name="property_name" disabled={isPending}
            placeholder="e.g. Sri Sai PG" value={formData.property_name} onChange={handleChange}
            className={`w-full bg-[#EEF2F8] border-2 rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium transition-colors ${fieldErrors.property_name ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[#008075]/30'}`}
          />
          {fieldErrors.property_name && <p className="text-[11px] font-bold text-red-500 ml-1">{fieldErrors.property_name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Property Address (optional)</label>
          <input 
            type="text" name="address" disabled={isPending}
            placeholder="e.g. Anna Nagar, Chennai" value={formData.address} onChange={handleChange}
            className="w-full bg-[#EEF2F8] border-2 border-transparent focus:border-[#008075]/30 rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Monthly Plan Amount (optional)</label>
          <div className={`flex items-center bg-[#EEF2F8] border-2 rounded-2xl transition-colors ${fieldErrors.plan_rupee ? 'border-red-400 focus-within:border-red-500' : 'border-transparent focus-within:border-[#008075]/30'}`}>
            <span className="pl-4 pr-2 font-bold text-[#718096]">₹</span>
            <input 
              type="number" name="plan_rupee" disabled={isPending}
              placeholder="e.g. 800" value={formData.plan_rupee} onChange={handleChange}
              className="w-full bg-transparent border-none py-4 pr-4 text-[#1A2B28] outline-none text-sm font-medium"
            />
          </div>
          <p className="text-[11px] font-medium text-[#718096] ml-1">The monthly amount you charge this owner</p>
          {fieldErrors.plan_rupee && <p className="text-[11px] font-bold text-red-500 ml-1">{fieldErrors.plan_rupee}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#1A2B28] ml-1">Admin Notes (optional)</label>
          <textarea 
            rows={3} name="admin_notes" disabled={isPending}
            placeholder="Any internal notes about this owner..." value={formData.admin_notes} onChange={handleChange}
            className="w-full bg-[#EEF2F8] border-2 border-transparent focus:border-[#008075]/30 rounded-2xl p-4 text-[#1A2B28] outline-none text-sm font-medium transition-colors"
          ></textarea>
        </div>

        <div className="pt-4">
          <button 
            type="submit" disabled={isPending}
            className="w-full bg-[#00685F] py-4 rounded-[20px] text-white font-black shadow-lg shadow-teal-900/10 flex justify-center items-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-70 disabled:scale-100"
          >
            {isPending ? (
              <><div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> Registering PG...</>
            ) : 'Register PG Owner'}
          </button>
        </div>
      </form>
    </div>
  )
}
