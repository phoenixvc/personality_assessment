import React from 'react';

const CombinationAnalysisTools: React.FC = () => {
  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-8 transition-transform duration-200 ease-in-out transform hover:translate-y-1">
      <h3 className="text-2xl font-bold mb-6">Trait Interaction Matrix</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-2">O×C Interaction</h4>
          <p className="text-sm text-gray-600">Innovation within structure</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-2">E×A Interaction</h4>
          <p className="text-sm text-gray-600">Social harmony and leadership</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-2">C×N Interaction</h4>
          <p className="text-sm text-gray-600">Performance and stability</p>
        </div>
      </div>
    </div>
  );
};

export default CombinationAnalysisTools;
