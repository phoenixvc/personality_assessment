import React from 'react';
import { motion } from 'framer-motion';

const EnneagramResults = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h2
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Enneagram Results
      </motion.h2>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 1: The Reformer</h3>
        <p className="text-gray-600 mb-4">
          Principled, purposeful, self-controlled, and perfectionistic.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>High standards and strong sense of ethics</li>
          <li>Desire for improvement and order</li>
          <li>Focus on doing things right</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 2: The Helper</h3>
        <p className="text-gray-600 mb-4">
          Generous, demonstrative, people-pleasing, and possessive.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong desire to help and support others</li>
          <li>Focus on building relationships</li>
          <li>Empathy and emotional awareness</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 3: The Achiever</h3>
        <p className="text-gray-600 mb-4">
          Adaptable, excelling, driven, and image-conscious.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Goal-oriented and success-driven</li>
          <li>Focus on personal achievements</li>
          <li>Desire for recognition and validation</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 4: The Individualist</h3>
        <p className="text-gray-600 mb-4">
          Expressive, dramatic, self-absorbed, and temperamental.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong sense of identity and individuality</li>
          <li>Focus on self-expression and creativity</li>
          <li>Desire for authenticity and emotional depth</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 5: The Investigator</h3>
        <p className="text-gray-600 mb-4">
          Perceptive, innovative, secretive, and isolated.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong desire for knowledge and understanding</li>
          <li>Focus on intellectual pursuits</li>
          <li>Preference for solitude and independence</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 6: The Loyalist</h3>
        <p className="text-gray-600 mb-4">
          Engaging, responsible, anxious, and suspicious.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong sense of loyalty and commitment</li>
          <li>Focus on security and stability</li>
          <li>Desire for guidance and support</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 7: The Enthusiast</h3>
        <p className="text-gray-600 mb-4">
          Spontaneous, versatile, acquisitive, and scattered.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong desire for new experiences and excitement</li>
          <li>Focus on enjoyment and adventure</li>
          <li>Preference for variety and spontaneity</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 8: The Challenger</h3>
        <p className="text-gray-600 mb-4">
          Self-confident, decisive, willful, and confrontational.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong desire for control and autonomy</li>
          <li>Focus on strength and assertiveness</li>
          <li>Preference for taking charge and leading</li>
        </ul>
      </motion.div>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Type 9: The Peacemaker</h3>
        <p className="text-gray-600 mb-4">
          Receptive, reassuring, complacent, and resigned.
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Strong desire for peace and harmony</li>
          <li>Focus on avoiding conflict and maintaining stability</li>
          <li>Preference for accommodating and mediating</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default EnneagramResults;
