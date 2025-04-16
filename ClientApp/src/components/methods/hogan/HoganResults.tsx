import React from 'react';
import { motion } from 'framer-motion';

const HoganResults = () => {
  const results = {
    decisionMaking: "High",
    teamwork: "Moderate",
    riskTaking: "Low",
    organization: "High",
    stressManagement: "Moderate",
    confidence: "High",
    openness: "Moderate",
    problemSolving: "High",
    empathy: "Moderate",
    motivation: "High"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Hogan Results</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(results).map((trait, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">{trait}</h3>
            <p className="text-gray-700">{results[trait]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HoganResults;
