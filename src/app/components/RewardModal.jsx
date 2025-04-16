'use client'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { toast } from 'react-hot-toast'

export default function RewardModal({ isOpen, onClose, initialData = null, onSave }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    xpCost: 0,
    category: 'lounge',
    quantity: null,
    available: true
  })

  useEffect(() => {
    if (initialData) setForm(initialData)
    else setForm({
      name: '',
      description: '',
      image: '',
      xpCost: 0,
      category: 'lounge',
      quantity: null,
      available: true
    })
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.image || !form.xpCost) {
      toast.error('Please fill all required fields')
      return
    }
    
    const isEdit = !!initialData?._id
    const endpoint = isEdit ? '/api/rewards/update' : '/api/rewards/create'
    const payload = isEdit
      ? { id: initialData._id, update: form }
      : form

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      toast.success(`Reward ${isEdit ? 'updated' : 'created'} successfully`)
      onSave()
      onClose()
    } else {
      toast.error('Something went wrong')
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md rounded-lg shadow p-6 space-y-4">
          <Dialog.Title className="text-lg font-bold text-[#132452]">
            {initialData ? 'Edit Reward' : 'Add Reward'}
          </Dialog.Title>

          <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm" />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm" />
          <input name="xpCost" type="number" placeholder="XP Cost" value={form.xpCost} onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm" />

          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm">
            <option value="lounge">Lounge</option>
            <option value="upgrade">Upgrade</option>
            <option value="flight">Flight</option>
          </select>

          <input name="quantity" type="number" placeholder="Quantity (optional)" value={form.quantity ?? ''} onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm" />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
            Available
          </label>

          <div className="flex justify-end gap-3 pt-3">
            <button onClick={onClose} className="text-gray-500 text-sm">Cancel</button>
            <button onClick={handleSubmit}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm px-4 py-1.5 rounded">
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
