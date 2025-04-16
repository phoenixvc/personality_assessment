import React from 'react';
import { motion } from 'framer-motion';

const Big5Results: React.FC = () => {
  return (
    <section id="big5-results" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Big 5 Personality Results</h2>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Openness</h3>
          <p className="text-gray-600">Your score: 75%</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: '75%' }}
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">You are open to new experiences and enjoy exploring new ideas and concepts.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Conscientiousness</h3>
          <p className="text-gray-600">Your score: 85%</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: '85%' }}
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">You are organized, responsible, and hardworking. You strive for excellence in everything you do.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Extraversion</h3>
          <p className="text-gray-600">Your score: 60%</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: '60%' }}
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">You are moderately outgoing and enjoy social interactions, but also value your alone time.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Agreeableness</h3>
          <p className="text-gray-600">Your score: 70%</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: '70%' }}
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">You are compassionate, cooperative, and value getting along with others.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Neuroticism</h3>
          <p className="text-gray-600">Your score: 40%</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: '40%' }}
              initial={{ width: 0 }}
              animate={{ width: '40%' }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-gray-600">You are emotionally stable and handle stress well, but may occasionally experience anxiety or mood swings.</p>
        </div>
      </motion.div>
    </section>
  );
};

export default Big5Results;
