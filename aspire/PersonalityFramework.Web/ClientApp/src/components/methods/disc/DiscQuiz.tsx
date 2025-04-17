import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DiscQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle quiz submission
    console.log('Quiz submitted:', answers);
  };

  return (
    <div className="disc-quiz">
      <h2 className="text-2xl font-bold mb-4">DISC Quiz</h2>
      <form onSubmit={handleSubmit}>
        {answers.map((answer, index) => (
          <motion.div
            key={index}
            className="mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Question {index + 1}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={answer}
              onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
              className="w-full"
            />
          </motion.div>
        ))}
        <motion.button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Submit
        </motion.button>
      </form>
    </div>
  );
};

export default DiscQuiz;
