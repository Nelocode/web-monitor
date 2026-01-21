import { prisma } from './prisma';
import axios from 'axios';
import { sendAlertNotification } from './notifications';

export async function checkAllSites() {
    console.log("Starting monitoring check...");
    const sites = await prisma.site.findMany();

    for (const site of sites) {
        const startTime = Date.now();
        let status = 'ONLINE';
        let latency = 0;
        let errorMessage = '';

        try {
            await axios.get(site.url, { timeout: 10000 });
            latency = Date.now() - startTime;
        } catch (error: any) {
            status = 'OFFLINE';
            errorMessage = error.message;
            latency = 0;
        }

        // Check if status changed
        if (site.status !== status) {
            console.log(`Status change for ${site.name}: ${site.status} -> ${status}`);
            
            // Send Alert ONLY if going offline
            if (status === 'OFFLINE') {
                await sendAlertNotification(site.name, site.url, status, errorMessage);
            }
        }

        // Update DB
        await prisma.site.update({
            where: { id: site.id },
            data: {
                status,
                lastChecked: new Date(),
                logs: {
                    create: {
                        status,
                        latency
                    }
                }
            }
        });
    }
    console.log("Monitoring check complete.");
}
