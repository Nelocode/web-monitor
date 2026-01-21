import { checkAllSites } from './lib/monitor';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        console.log('Instrumentation registered. Starting background monitor...');
        
        // Initial check after 10 seconds
        setTimeout(() => {
            checkAllSites();
        }, 10000);

        // Periodic check every 5 minutes (300000 ms)
        // Note: In serverless, this won't persist. In a VPS running 'next start', it will.
        setInterval(() => {
            checkAllSites();
        }, 300000); 
    }
}
