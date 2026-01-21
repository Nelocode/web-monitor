'use client'

import { deleteSite } from "@/app/actions"
import { useTransition, useState } from "react"
import AiAnalysisModal from "./AiAnalysisModal"

export default function SiteCard({ site }: { site: any }) {
    const [isPending, startTransition] = useTransition()
    const [showAi, setShowAi] = useState(false)

    const handleDelete = () => {
        if (confirm('Are you sure you want to stop monitoring this site?')) {
            startTransition(() => {
                deleteSite(site.id)
            })
        }
    }

    const statusColor = site.status === 'ONLINE' ? 'bg-green-500' : 
                        site.status === 'OFFLINE' ? 'bg-red-500' : 'bg-yellow-500'

    return (
        <>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="flex items-start justify-between mb-4 relative">
                <div className="overflow-hidden">
                    <h3 className="text-xl font-bold mb-1 truncate pr-2">{site.name}</h3>
                    <a href={site.url} target="_blank" className="text-blue-400 text-sm hover:underline block truncate">{site.url}</a>
                </div>
                
                {/* Status Badge - Fades out on hover */}
                <div className={`shrink-0 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor} bg-opacity-20 text-${statusColor.split('-')[1]}-400 transition-opacity duration-200 group-hover:opacity-0`}>
                    <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                    {site.status}
                </div>

                {/* Remove Button - Fades in on hover, absolute positioned over the badge area */}
                <div className="absolute top-0 right-0 h-full flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); // Safety
                            handleDelete();
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-colors"
                        title="Remove Site"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 bg-black/20 p-4 rounded-lg mb-4 flex-1">
                <div>
                    <span className="block text-xs uppercase tracking-wider opacity-60 mb-1">Last Checked</span>
                    <span className="text-white">{site.lastChecked ? new Date(site.lastChecked).toLocaleString() : 'Never'}</span>
                </div>
                <div>
                     <span className="block text-xs uppercase tracking-wider opacity-60 mb-1">Latency</span>
                     <span className="text-white">{site.logs?.[0]?.latency ? `${site.logs[0].latency}ms` : '--'}</span>
                </div>
                <div>
                    <span className="block text-xs uppercase tracking-wider opacity-60 mb-1">Domain Expiry</span>
                    <span className={site.domainExpiry ? 'text-white' : 'text-yellow-500/50'}>
                        {site.domainExpiry ? new Date(site.domainExpiry).toLocaleDateString() : 'Unknown'}
                    </span>
                </div>
                <div>
                    <span className="block text-xs uppercase tracking-wider opacity-60 mb-1">Registrar</span>
                    <span className="text-white truncated block truncate">{site.registrar || '--'}</span>
                </div>
            </div>

            <button 
                onClick={() => setShowAi(true)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-emerald-600/20 hover:from-blue-600/30 hover:to-emerald-600/30 border border-white/5 text-sm font-medium text-blue-200 transition-all flex items-center justify-center gap-2"
            >
                ✨ AI Insights
            </button>
        </div>

        {showAi && (
            <AiAnalysisModal 
                siteId={site.id} 
                url={site.url} 
                onClose={() => setShowAi(false)} 
            />
        )}
        </>
    )
}
