import React from 'react';

interface Trait {
  label: string;
  type: 'low' | 'moderate' | 'high';
}

interface CombinationCardProps {
  title: string;
  traits: Trait[];
  description: string;
  points: string[];
  iconBg: string;
  iconColor: string;
  iconText: string;
}

const CombinationCard: React.FC<CombinationCardProps> = ({ title, traits, description, points, iconBg, iconColor, iconText }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 combination-card transition-all duration-300 ease-in-out transform hover:translate-y-1 hover:shadow-xl">
      <div className="content">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-110`}>
            <span className={`${iconColor} text-xl font-bold`}>{iconText}</span>
          </div>
          <h3 className="text-xl font-bold ml-4">{title}</h3>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {traits.map((trait, index) => (
            <span 
              key={index} 
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                ${trait.type === 'high' ? 'bg-green-100 text-green-800' : 
                  trait.type === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'} 
                transition-transform duration-200 ease-in-out transform hover:scale-105`}
            >
              {trait.label}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="list-disc pl-5 text-gray-700">
          {points.map((point, index) => (
            <li key={index} className="transition-transform duration-200 ease-in-out transform hover:translate-x-1">{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CombinationCard;
