import React from 'react';
import { motion } from 'framer-motion';

const MyersBriggsResults = ({ results }) => {
  return (
    <div className="myers-briggs-results">
      <h2 className="text-3xl font-bold mb-8 text-center">Myers-Briggs Results</h2>
      <motion.div
        className="result-section mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Personality Type</h3>
        <p className="text-lg">{results.personalityType}</p>
      </motion.div>
      <motion.div
        className="result-section mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Description</h3>
        <p className="text-lg">{results.description}</p>
      </motion.div>
      <motion.div
        className="result-section mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Strengths</h3>
        <ul className="list-disc pl-5 text-lg">
          {results.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        className="result-section mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Weaknesses</h3>
        <ul className="list-disc pl-5 text-lg">
          {results.weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        className="result-section mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Career Paths</h3>
        <ul className="list-disc pl-5 text-lg">
          {results.careerPaths.map((careerPath, index) => (
            <li key={index}>{careerPath}</li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        className="result-section mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Famous Personalities</h3>
        <ul className="list-disc pl-5 text-lg">
          {results.famousPersonalities.map((personality, index) => (
            <li key={index}>{personality}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default MyersBriggsResults;
