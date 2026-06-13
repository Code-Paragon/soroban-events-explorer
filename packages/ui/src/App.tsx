import { useEffect, useState } from 'react';
import EventCard from './components/EventCard';

export default function App() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [contractFilter, setContractFilter] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchEvents = (filterVal: string) => {
    const url = filterVal.trim()
      ? `http://localhost:3001/events?limit=25&contractId=${encodeURIComponent(filterVal.trim())}`
      : 'http://localhost:3001/events?limit=25';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.events) {
          setEvents(data.events);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  };

  // Poll for events. Reset timer when the filter changes to fetch immediately.
  useEffect(() => {
    fetchEvents(contractFilter);
    const interval = setInterval(() => fetchEvents(contractFilter), 5000);
    return () => clearInterval(interval);
  }, [contractFilter]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setToast({ message: `Copied ${label} to clipboard`, type: 'success' });
        setTimeout(() => setToast(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard:', err);
        setToast({ message: `Failed to copy ${label}`, type: 'error' });
        setTimeout(() => setToast(null), 2000);
      });
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto font-mono text-white bg-gray-900 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl font-mono text-sm border transition-all duration-300 transform translate-y-0 animate-pulse ${
            toast.type === 'success'
              ? 'bg-gray-950 border-emerald-500/50 text-emerald-400 shadow-emerald-950/20'
              : 'bg-gray-950 border-rose-500/50 text-rose-400 shadow-rose-950/20'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
          ></span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Soroban Events Explorer</h1>
        <p className="text-gray-400 mt-2">Listening for ledger events from database...</p>
      </header>

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-800/40 p-4 border border-gray-700/60 rounded-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-blue-400 font-bold text-sm">Filter:</span>
          <input
            type="text"
            placeholder="Search Contract Address..."
            value={contractFilter}
            onChange={(e) => setContractFilter(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded px-3 py-1.5 text-sm w-full sm:w-80 focus:outline-none focus:border-blue-500/50 text-white font-mono placeholder:text-gray-600 transition-colors"
          />
          {contractFilter && (
            <button
              onClick={() => setContractFilter('')}
              className="text-gray-400 hover:text-white px-2 py-1 text-xs border border-gray-700 rounded hover:bg-gray-800/80 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 font-bold self-end sm:self-center">
          Showing {events.length} event(s)
        </div>
      </div>

      {/* Events Feed Container */}
      <div className="flex flex-col gap-6">
        {loading && events.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-gray-800 rounded-lg bg-gray-800/10">
            <span className="inline-block animate-pulse">Loading events...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-gray-800 rounded-lg bg-gray-800/10 font-bold">
            No events found.
          </div>
        ) : (
          events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onCopy={handleCopy}
            />
          ))
        )}
      </div>
    </div>
  );
}