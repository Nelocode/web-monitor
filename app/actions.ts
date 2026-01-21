'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
const whoiser = require("whoiser")

export async function addSite(formData: FormData) {
  const url = formData.get("url") as string
  const name = formData.get("name") as string

  if (!url || !name) {
    throw new Error("URL and Name are required")
  }

  // Basic validation
  // Ensure protocol
  let finalUrl = url
  if (!url.startsWith('http')) {
    finalUrl = `https://${url}`
  }

  try {
    // Initial Whois fetch
    let domain = finalUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    const whoisData = await whoiser.whoisDomain(domain) as any
    // Simplified whois parsing - reliable parsing is complex, taking first expiry found
    let expiryDate: Date | null = null
    let registrarStr: string | null = null

    // Try to find expiry in common fields
    const firstKey = Object.keys(whoisData)[0]
    if (whoisData[firstKey]) {
        const info = whoisData[firstKey]
        const expiry = info['Registry Expiry Date'] || info['Expiry Date']
        if (expiry) {
            expiryDate = new Date(expiry)
        }
        registrarStr = info['Registrar'] || info['Sponsoring Registrar']
    }

    await prisma.site.create({
      data: {
        name,
        url: finalUrl,
        status: "PENDING",
        domainExpiry: expiryDate,
        registrar: registrarStr
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error adding site:", error)
    return { success: false, error: "Failed to add site" }
  }
}

export async function getSites() {
  return await prisma.site.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
        logs: {
            take: 1,
            orderBy: { timestamp: 'desc' }
        }
    }
  })
}

export async function deleteSite(id: string) {
    await prisma.site.delete({ where: { id } })
    revalidatePath("/")
}
