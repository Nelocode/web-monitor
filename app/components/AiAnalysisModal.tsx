'use client'

import { analyzeSiteContent } from "@/app/actions-ai"
import { useState } from "react"
import ReactMarkdown from 'react-markdown' // Need to install this or just render text

// Since I can't install new packages easily right now without waiting, I'll do basic rendering or whitespace pre-wrap.
// Installing react-markdown would be better, but I'll skip to save time unless requested.
// I will use whitespace-pre-wrap div.

export default function AiAnalysisModal({ siteId, url, onClose }: { siteId: string, url: string, onClose: () => void }) {
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        setLoading(true)
        setError(null)
        const result = await analyzeSiteContent(siteId)
        if (result.error) {
            setError(result.error)
        } else {
            setAnalysis(result.analysis || "No analysis returned.")
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-white/10 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        AI Analysis: {url}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 text-gray-300">
                    {!analysis && !loading && !error && (
                        <div className="text-center py-10">
                            <p className="mb-4">Get actionable insights powered by Gemini AI.</p>
                            <button 
                                onClick={handleAnalyze}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold transition-all hover:scale-105"
                            >
                                ✨ Generate AI Report
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                            <p className="animate-pulse">Analyzing website structure and content...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {analysis && (
                        <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                            {analysis}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
