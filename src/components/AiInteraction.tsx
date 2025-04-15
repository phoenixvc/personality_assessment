import React from 'react';

const AiInteraction: React.FC = () => {
  return (
    <section id="ai-interaction" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">AI Interaction</h2>
      
      <div className="bg-white rounded-xl shadow-lg p-8 transition-transform duration-200 ease-in-out transform hover:translate-y-1">
        <h3 className="text-2xl font-bold mb-6">AI-Based Personality Insights</h3>
        <p className="text-gray-600 mb-4">Get personalized insights and recommendations based on your personality traits.</p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Understand your strengths and weaknesses</li>
          <li>Receive tailored advice for personal growth</li>
          <li>Explore career paths that align with your personality</li>
        </ul>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-lg p-8 transition-transform duration-200 ease-in-out transform hover:translate-y-1">
        <h3 className="text-2xl font-bold mb-6">AI Recommendations</h3>
        <p className="text-gray-600 mb-4">Discover activities and experiences that suit your personality.</p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Personalized activity suggestions</li>
          <li>Recommended books and articles</li>
          <li>Workshops and events to attend</li>
        </ul>
      </div>
    </section>
  );
};

export default AiInteraction;
