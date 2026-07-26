import { useState } from 'react';
import type { HashtagData } from './data/mockData';
import HashtagCard from './components/HashtagCard';
import { Search, Info, Loader2 } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<HashtagData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:8000/api/analyze?hashtag=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis from backend.');
      }
      const data = await response.json();
      setResult(data as HashtagData);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Politi<span className="text-blue-600">Tilt</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Scientifically mapping the Indian political spectrum</p>
          </div>
          <button className="text-gray-500 hover:text-blue-600 transition-colors">
            <Info size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8 shadow-sm rounded-xl overflow-hidden flex">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-24 py-4 border-gray-300 rounded-l-xl focus:ring-blue-500 focus:border-blue-500 text-lg transition-shadow"
            placeholder="Enter a hashtag (e.g., #UnionBudget2024)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold rounded-r-xl transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Analyze'}
          </button>
        </form>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
             <div className="text-center py-12 text-gray-500 flex flex-col items-center">
               <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
               <p>Fetching and analyzing live tweets with CardiffNLP RoBERTa...</p>
             </div>
          )}

          {error && (
             <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center font-medium border border-red-200">
                {error}
             </div>
          )}

          {!loading && !error && result && (
            <HashtagCard data={result} />
          )}

          {!loading && !error && !result && (
            <div className="text-center py-12 text-gray-500">
              Enter a hashtag to start analyzing political leaning.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
