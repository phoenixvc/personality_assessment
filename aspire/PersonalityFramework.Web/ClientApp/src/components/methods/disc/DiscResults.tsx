import React from 'react';
import { motion } from 'framer-motion';

const DiscResults: React.FC = () => {
  const results = {
    dominance: 8,
    influence: 6,
    steadiness: 7,
    compliance: 5,
  };

  return (
    <div className="disc-results">
      <h2 className="text-2xl font-bold mb-4">DISC Results</h2>
      <motion.div
        className="result-section mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold">Dominance</h3>
        <p className="text-gray-600">Score: {results.dominance}</p>
      </motion.div>
      <motion.div
        className="result-section mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold">Influence</h3>
        <p className="text-gray-600">Score: {results.influence}</p>
      </motion.div>
      <motion.div
        className="result-section mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold">Steadiness</h3>
        <p className="text-gray-600">Score: {results.steadiness}</p>
      </motion.div>
      <motion.div
        className="result-section mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold">Compliance</h3>
        <p className="text-gray-600">Score: {results.compliance}</p>
      </motion.div>
    </div>
  );
};

export default DiscResults;
