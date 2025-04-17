import React from 'react';
import { motion } from 'framer-motion';

const SixteenPFResults: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h2
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Sixteen Personality Factor (16PF) Results
      </motion.h2>
      
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Your Personality Profile</h3>
        <p className="text-gray-600 mb-4">Based on your responses, here are your 16PF results:</p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Warmth: High</li>
          <li>Reasoning: Moderate</li>
          <li>Emotional Stability: Low</li>
          <li>Dominance: High</li>
          <li>Liveliness: Moderate</li>
          <li>Rule-Consciousness: High</li>
          <li>Social Boldness: Low</li>
          <li>Sensitivity: High</li>
          <li>Vigilance: Moderate</li>
          <li>Abstractedness: Low</li>
          <li>Privateness: High</li>
          <li>Apprehension: Moderate</li>
          <li>Openness to Change: High</li>
          <li>Self-Reliance: Low</li>
          <li>Perfectionism: High</li>
          <li>Tension: Moderate</li>
        </ul>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Trait Analysis</h3>
        <p className="text-gray-600 mb-4">Here is a detailed analysis of your personality traits:</p>
        <ul className="list-disc pl-5 text-gray-700">
          <li><strong>Warmth:</strong> You are very warm and friendly, making others feel comfortable around you.</li>
          <li><strong>Reasoning:</strong> You have a moderate level of reasoning ability, able to think logically and solve problems.</li>
          <li><strong>Emotional Stability:</strong> You may experience emotional ups and downs, but you are working on managing your emotions.</li>
          <li><strong>Dominance:</strong> You have a strong presence and tend to take charge in situations.</li>
          <li><strong>Liveliness:</strong> You have a moderate level of liveliness, enjoying social interactions but also valuing quiet time.</li>
          <li><strong>Rule-Consciousness:</strong> You are very conscientious and adhere to rules and guidelines.</li>
          <li><strong>Social Boldness:</strong> You may feel shy or reserved in social situations, but you are working on building your confidence.</li>
          <li><strong>Sensitivity:</strong> You are highly sensitive to the feelings and needs of others.</li>
          <li><strong>Vigilance:</strong> You have a moderate level of vigilance, being cautious and aware of your surroundings.</li>
          <li><strong>Abstractedness:</strong> You may find it challenging to focus on abstract concepts, preferring concrete ideas.</li>
          <li><strong>Privateness:</strong> You value your privacy and tend to keep personal matters to yourself.</li>
          <li><strong>Apprehension:</strong> You may feel anxious or apprehensive at times, but you are working on building your self-confidence.</li>
          <li><strong>Openness to Change:</strong> You are very open to new experiences and willing to embrace change.</li>
          <li><strong>Self-Reliance:</strong> You may prefer to rely on others for support, but you are working on building your independence.</li>
          <li><strong>Perfectionism:</strong> You have high standards and strive for perfection in everything you do.</li>
          <li><strong>Tension:</strong> You may experience moderate levels of tension, but you are working on managing stress effectively.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SixteenPFResults;
