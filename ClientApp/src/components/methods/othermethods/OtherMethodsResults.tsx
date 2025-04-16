import React from 'react';
import { motion } from 'framer-motion';

const OtherMethodsResults: React.FC = () => {
  const results = [
    { trait: 'Trait 1', description: 'Description for Trait 1' },
    { trait: 'Trait 2', description: 'Description for Trait 2' },
    { trait: 'Trait 3', description: 'Description for Trait 3' },
    { trait: 'Trait 4', description: 'Description for Trait 4' },
    { trait: 'Trait 5', description: 'Description for Trait 5' },
  ];

  return (
    <div className="other-methods-results">
      <h2 className="text-2xl font-bold mb-4">Other Methods Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, index) => (
          <motion.div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-2">{result.trait}</h3>
            <p className="text-gray-700">{result.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OtherMethodsResults;
