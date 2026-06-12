import { useEffect, useState } from 'react';

export default function App() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = () => {
    fetch('http://localhost:3001/events?limit=25')
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

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatContractId = (contractId: string) => {
    if (!contractId) return '';
    if (contractId.length > 12) {
      return `${contractId.substring(0, 6)}...${contractId.substring(contractId.length - 4)}`;
    }
    return contractId;
  };

  const formatData = (data: string) => {
    if (!data) return '';
    if (data.length > 25) {
      return data.substring(0, 22) + '...';
    }
    return data;
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto font-mono text-white bg-gray-900">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Soroban Events Explorer</h1>
        <p className="text-gray-400 mt-2">Listening for ledger events from database...</p>
      </header>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-xl">
        <div className="flex justify-between text-xs text-gray-500 border-b border-gray-700 pb-2 mb-4 font-bold">
          <span className="w-1/4">EVENT ID</span>
          <span className="w-1/4">CONTRACT</span>
          <span className="w-1/4">TOPIC</span>
          <span className="w-1/4 text-right">DATA (XDR)</span>
        </div>
        
        {loading && events.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-6 text-gray-500 font-bold">No events found in database.</div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="flex justify-between items-center py-3 border-b border-gray-700/50 hover:bg-gray-700/30 px-2 transition-colors">
              <span className="text-green-400 w-1/4 truncate pr-2" title={ev.id}>{ev.id}</span>
              <span className="text-purple-400 w-1/4" title={ev.contractId}>{formatContractId(ev.contractId)}</span>
              <span className="text-yellow-400 w-1/4 truncate pr-2" title={ev.topic}>{ev.topic}</span>
              <span className="text-gray-300 w-1/4 text-right truncate" title={ev.data}>{formatData(ev.data)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}