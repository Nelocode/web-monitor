import axios from 'axios';

export async function sendAlertNotification(siteName: string, url: string, status: string, error?: string) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("Skipping notification: N8N_WEBHOOK_URL not set.");
        return;
    }

    const payload = {
        event: 'site_status_change',
        siteName,
        url,
        status,
        error: error || null,
        timestamp: new Date().toISOString()
    };

    try {
        await axios.post(webhookUrl, payload);
        console.log(`Notification sent to n8n for ${siteName}`);
    } catch (err: any) {
        console.error("Failed to send notification to n8n:", err.message);
    }
}
