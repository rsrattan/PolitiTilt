import React from 'react';

interface SpectrumGaugeProps {
  score: number;
}

const SpectrumGauge: React.FC<SpectrumGaugeProps> = ({ score }) => {
  // Map score from [-100, 100] to [0%, 100%]
  const position = ((score + 100) / 200) * 100;

  // Determine color based on score
  let color = 'bg-gray-500'; // Center
  if (score < -20) color = 'bg-red-500'; // Left (using red for left, blue for right as a generic placeholder, can adjust based on Indian context if needed, but red/saffron or red/blue are common. Let's stick to standard Red-Left, Blue-Right for now for visualization purposes).
  if (score > 20) color = 'bg-blue-500'; // Right

  return (
    <div className="w-full py-4">
      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-gray-200 to-blue-200 opacity-50"></div>

        {/* Indicator */}
        <div
          className={`absolute top-0 h-full w-2 rounded-full shadow-md transform -translate-x-1 transition-all duration-500 ease-in-out ${color}`}
          style={{ left: `${position}%` }}
        ></div>
      </div>
      <div className="text-center mt-2 text-sm font-bold">
        Score: {score > 0 ? `+${score}` : score}
      </div>
    </div>
  );
};

export default SpectrumGauge;
