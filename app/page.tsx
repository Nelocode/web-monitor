import { getSites } from "./actions";
import AddSiteForm from "./components/AddSiteForm";
import SiteCard from "./components/SiteCard";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const sites = await getSites()

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Web Monitor
            </h1>
            <p className="text-gray-400 text-lg">Real-time status tracking & domain intelligence.</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                  <span className="text-gray-400">Total Sites:</span> <strong className="text-white ml-2">{sites.length}</strong>
              </div>
          </div>
        </header>

        <AddSiteForm />

        {sites.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
                <p className="text-gray-500 text-lg">No websites monitored yet.</p>
                <p className="text-gray-600">Add your first site above to get started.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
