import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HoganQuiz = () => {
  const [answers, setAnswers] = useState(Array(10).fill(null));

  const questions = [
    "I am good at making decisions quickly.",
    "I enjoy working in a team environment.",
    "I am comfortable taking risks.",
    "I am detail-oriented and organized.",
    "I am good at managing stress.",
    "I am confident in my abilities.",
    "I am open to new experiences.",
    "I am good at solving problems.",
    "I am empathetic towards others.",
    "I am motivated to achieve my goals."
  ];

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Hogan Quiz</h2>
      <form>
        {questions.map((question, index) => (
          <motion.div
            key={index}
            className="mb-6 p-4 bg-white rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-700 mb-4">{question}</p>
            <div className="flex justify-around">
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="1"
                  checked={answers[index] === "1"}
                  onChange={() => handleAnswerChange(index, "1")}
                />
                Strongly Disagree
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="2"
                  checked={answers[index] === "2"}
                  onChange={() => handleAnswerChange(index, "2")}
                />
                Disagree
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="3"
                  checked={answers[index] === "3"}
                  onChange={() => handleAnswerChange(index, "3")}
                />
                Neutral
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="4"
                  checked={answers[index] === "4"}
                  onChange={() => handleAnswerChange(index, "4")}
                />
                Agree
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="5"
                  checked={answers[index] === "5"}
                  onChange={() => handleAnswerChange(index, "5")}
                />
                Strongly Agree
              </label>
            </div>
          </motion.div>
        ))}
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Submit
        </motion.button>
      </form>
    </div>
  );
};

export default HoganQuiz;
