import React from 'react';
import type { HashtagData } from '../data/mockData';
import SpectrumGauge from './SpectrumGauge';
import { Users, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';

interface HashtagCardProps {
  data: HashtagData;
}

const HashtagCard: React.FC<HashtagCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{data.hashtag}</h2>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <TrendingUp size={16} className="mr-1" />
            <span>Rank #{data.trendingRank} Trending</span>
            <span className="mx-2">•</span>
            <MessageSquare size={16} className="mr-1" />
            <span>{data.tweetCount.toLocaleString()} Tweets</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Political Spectrum</h3>
        <SpectrumGauge score={data.spectrumScore} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <AlertTriangle size={20} className="mr-2 text-yellow-500" />
          Why this score? (NLP Breakdown)
        </h3>
        <p className="text-gray-700 text-sm mb-3">
          <strong>Policy Stance:</strong> {data.breakdown.policyStance}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.breakdown.keyThemes.map(theme => (
             <span key={theme} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
               {theme}
             </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Sentiment:</strong> {data.breakdown.sentiment}
          </div>
          <div>
             <strong>Dominant Lang:</strong> {data.breakdown.dominantLanguage}
          </div>
          <div>
             <strong>Echo Chamber Density:</strong> {(data.echoChamberDensity * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div>
         <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
            <Users size={16} className="mr-1" />
            Top Influencers
         </h3>
         <div className="flex flex-col gap-2">
           {data.topInfluencers.map((inf, idx) => (
             <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
               <span><strong>{inf.name}</strong> <span className="text-gray-500">{inf.handle}</span></span>
               <span className={`font-mono text-xs px-2 py-1 rounded ${inf.leaning > 0 ? 'bg-blue-100 text-blue-800' : inf.leaning < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200'}`}>
                 Score: {inf.leaning > 0 ? `+${inf.leaning}` : inf.leaning}
               </span>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default HashtagCard;
