import { useState } from 'react';
import { mockHashtags } from './data/mockData';
import HashtagCard from './components/HashtagCard';
import { Search, Info } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHashtags = mockHashtags.filter(h =>
    h.hashtag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.breakdown.keyThemes.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <div className="relative mb-8 shadow-sm rounded-xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg transition-shadow"
            placeholder="Search hashtags or political themes (e.g., #UnionBudget2024, Economy)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredHashtags.length > 0 ? (
            filteredHashtags.map(hashtag => (
              <HashtagCard key={hashtag.id} data={hashtag} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No trending hashtags found matching "{searchTerm}".
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
