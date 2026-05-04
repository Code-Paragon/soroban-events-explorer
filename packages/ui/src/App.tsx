import { useEffect, useState } from 'react';

export default function App() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // MOCK EXECUTION:
    // In a real environment, this should poll or connect via WebSockets to our Fastify API.
    
    // GOOD FIRST ISSUE TODO:
    // 1. Fetch from `http://localhost:3001/events`.
    // 2. Handle CORS issues in the Fastify API.
    // 3. Implement a real-time WebSocket connection instead of HTTP polling.
    
    setEvents([
      { id: "event_1", contractId: "CC7...F3A", topic: "transfer", amount: "100 XLM" },
      { id: "event_2", contractId: "CDA...9BB", topic: "mint", amount: "5000 USDC" }
    ]);
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto font-mono">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Soroban Events Explorer</h1>
        <p className="text-gray-400 mt-2">V1 Scaffold: Listening for ledger events...</p>
      </header>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-xl">
        <div className="flex justify-between text-xs text-gray-500 border-b border-gray-700 pb-2 mb-4">
          <span>EVENT ID</span>
          <span>CONTRACT</span>
          <span>TOPIC</span>
          <span>DATA</span>
        </div>
        
        {events.map((ev) => (
          <div key={ev.id} className="flex justify-between items-center py-3 border-b border-gray-700/50 hover:bg-gray-700/30 px-2 transition-colors">
            <span className="text-green-400">{ev.id}</span>
            <span className="text-purple-400">{ev.contractId}</span>
            <span className="text-yellow-400">{ev.topic}</span>
            <span className="text-gray-300">{ev.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}