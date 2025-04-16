import React from 'react';

const YerbriggsResults: React.FC = () => {
  return (
    <section id="yerbriggs-results" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Yerbriggs Personality Results</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Introversion (I) vs. Extraversion (E)</h3>
            <p className="text-gray-600 mb-4">Your preference for focusing on the inner world or the outer world.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Sensing (S) vs. Intuition (N)</h3>
            <p className="text-gray-600 mb-4">Your preference for taking in information through your senses or through patterns and possibilities.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Thinking (T) vs. Feeling (F)</h3>
            <p className="text-gray-600 mb-4">Your preference for making decisions based on logic or based on people and circumstances.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Judging (J) vs. Perceiving (P)</h3>
            <p className="text-gray-600 mb-4">Your preference for living a structured and decided lifestyle or a flexible and adaptable lifestyle.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YerbriggsResults;
