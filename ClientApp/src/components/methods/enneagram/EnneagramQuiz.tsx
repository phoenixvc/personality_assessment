import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EnneagramQuiz = () => {
  const [answers, setAnswers] = useState(Array(9).fill(null));

  const questions = [
    "I am a perfectionist and have high standards.",
    "I am helpful and empathetic towards others.",
    "I am driven and ambitious.",
    "I am creative and expressive.",
    "I am analytical and detail-oriented.",
    "I am loyal and responsible.",
    "I am enthusiastic and spontaneous.",
    "I am confident and assertive.",
    "I am easygoing and accommodating."
  ];

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Enneagram Quiz</h2>
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

export default EnneagramQuiz;
