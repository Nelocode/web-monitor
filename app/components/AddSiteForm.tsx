'use client'

import { addSite } from "@/app/actions"
import { useState } from "react"

export default function AddSiteForm() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await addSite(formData)
    setLoading(false)
    setOpen(false)
  }

  if (!open) {
      return (
          <button 
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add New Site
          </button>
      )
  }

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
      <h2 className="text-xl font-semibold mb-4">Monitor New Website</h2>
      <form action={handleSubmit} className="flex gap-4 flex-col md:flex-row">
        <input
          name="name"
          type="text"
          placeholder="Site Name (e.g. My Portfolio)"
          required
          className="bg-black/20 border border-white/10 rounded px-4 py-2 flex-1 focus:outline-none focus:border-blue-500"
        />
        <input
          name="url"
          type="text"
          placeholder="domain.com"
          required
          className="bg-black/20 border border-white/10 rounded px-4 py-2 flex-1 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
            <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
            >
            {loading ? "Adding..." : "Start Monitoring"}
            </button>
            <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded"
            >
            Cancel
            </button>
        </div>
      </form>
    </div>
  )
}
