import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MyersBriggsQuiz = () => {
  const [answers, setAnswers] = useState({});
  const questions = [
    { id: 1, text: 'You enjoy vibrant social events with lots of people.' },
    { id: 2, text: 'You often spend time exploring unrealistic yet intriguing ideas.' },
    { id: 3, text: 'Your travel plans are more likely to look like a rough list of ideas than a detailed itinerary.' },
    { id: 4, text: 'You often think about what you should have said in a conversation long after it has taken place.' },
    { id: 5, text: 'If your friend is sad about something, your first instinct is to support them emotionally, not try to solve their problem.' },
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted answers:', answers);
  };

  return (
    <div className="myers-briggs-quiz">
      <h2 className="text-3xl font-bold mb-8 text-center">Myers-Briggs Quiz</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <motion.div
            key={question.id}
            className="mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg mb-2">{question.text}</p>
            <div className="flex justify-between">
              <label>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="1"
                  onChange={() => handleAnswerChange(question.id, 1)}
                  className="mr-2"
                />
                Strongly Disagree
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="2"
                  onChange={() => handleAnswerChange(question.id, 2)}
                  className="mr-2"
                />
                Disagree
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="3"
                  onChange={() => handleAnswerChange(question.id, 3)}
                  className="mr-2"
                />
                Neutral
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="4"
                  onChange={() => handleAnswerChange(question.id, 4)}
                  className="mr-2"
                />
                Agree
              </label>
              <label>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="5"
                  onChange={() => handleAnswerChange(question.id, 5)}
                  className="mr-2"
                />
                Strongly Agree
              </label>
            </div>
          </motion.div>
        ))}
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Submit
        </motion.button>
      </form>
    </div>
  );
};

export default MyersBriggsQuiz;
