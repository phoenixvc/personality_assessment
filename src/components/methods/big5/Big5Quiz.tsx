import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Big5Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section id="big5-quiz" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Big 5 Personality Quiz</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Question 1: How do you handle stress?</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question1"
                value="option1"
                onChange={() => handleAnswerChange('question1', 'option1')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I stay calm and composed
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question1"
                value="option2"
                onChange={() => handleAnswerChange('question1', 'option2')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I get anxious and worried
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question1"
                value="option3"
                onChange={() => handleAnswerChange('question1', 'option3')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I seek support from others
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Question 2: How do you approach new experiences?</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question2"
                value="option1"
                onChange={() => handleAnswerChange('question2', 'option1')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I embrace them with excitement
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question2"
                value="option2"
                onChange={() => handleAnswerChange('question2', 'option2')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I approach them cautiously
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question2"
                value="option3"
                onChange={() => handleAnswerChange('question2', 'option3')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I avoid them if possible
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Question 3: How do you prefer to work?</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question3"
                value="option1"
                onChange={() => handleAnswerChange('question3', 'option1')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I prefer working in a team
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question3"
                value="option2"
                onChange={() => handleAnswerChange('question3', 'option2')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I prefer working alone
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question3"
                value="option3"
                onChange={() => handleAnswerChange('question3', 'option3')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I am flexible and can work in both settings
            </label>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Question 4: How do you make decisions?</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question4"
                value="option1"
                onChange={() => handleAnswerChange('question4', 'option1')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I rely on logic and analysis
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question4"
                value="option2"
                onChange={() => handleAnswerChange('question4', 'option2')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I rely on my intuition and feelings
            </label>
            <label className="flex items-center">
              <motion.input
                type="radio"
                name="question4"
                value="option3"
                onChange={() => handleAnswerChange('question4', 'option3')}
                className="mr-2 transition-transform duration-200 ease-in-out transform hover:scale-105"
                whileHover={{ scale: 1.1 }}
              />
              I consider both logic and feelings
            </label>
          </div>
        </div>
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
        >
          Submit
        </motion.button>
      </form>
    </section>
  );
};

export default Big5Quiz;
