'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function analyzeSiteContent(siteId: string) {
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new Error("Site not found");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { error: "Gemini API Key not configured" };

    try {
        // Fetch site HTML
        const response = await axios.get(site.url, { timeout: 10000 });
        const html = response.data;
        
        // Basic Cleanup: remove scripts, styles to save tokens and noise
        const textContent = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                                .replace(/<[^>]+>/g, " ") // strip tags
                                .replace(/\s+/g, " ") // collapse whitespace
                                .substring(0, 20000); // limit chars

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Analyze the following website content for "${site.url}". 
        Provide a concise report with:
        1. SEO Score estimation (Low/Medium/High) and why.
        2. Content Quality assessment.
        3. 3 specific actionable recommendations for improvement.
        
        Website Content Snippet:
        ${textContent}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { success: true, analysis: text };

    } catch (error: any) {
        console.error("AI Analysis failed:", error);
        return { error: "Failed to analyze site: " + error.message };
    }
}
