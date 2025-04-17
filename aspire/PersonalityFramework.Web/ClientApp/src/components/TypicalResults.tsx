import React from 'react';

const TypicalResults: React.FC = () => {
  return (
    <section id="typical-results" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Typical Results</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Openness</h3>
            <p className="text-gray-600 mb-4">High Openness: Creative, curious, and open to new experiences.</p>
            <p className="text-gray-600 mb-4">Low Openness: Practical, conventional, and prefers routine.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Conscientiousness</h3>
            <p className="text-gray-600 mb-4">High Conscientiousness: Organized, dependable, and goal-oriented.</p>
            <p className="text-gray-600 mb-4">Low Conscientiousness: Spontaneous, flexible, and less focused on goals.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Extraversion</h3>
            <p className="text-gray-600 mb-4">High Extraversion: Outgoing, energetic, and enjoys social interactions.</p>
            <p className="text-gray-600 mb-4">Low Extraversion: Reserved, introspective, and prefers solitary activities.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Agreeableness</h3>
            <p className="text-gray-600 mb-4">High Agreeableness: Compassionate, cooperative, and values harmony.</p>
            <p className="text-gray-600 mb-4">Low Agreeableness: Competitive, critical, and values self-interest.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 result-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Neuroticism</h3>
            <p className="text-gray-600 mb-4">High Neuroticism: Anxious, moody, and prone to negative emotions.</p>
            <p className="text-gray-600 mb-4">Low Neuroticism: Calm, emotionally stable, and less prone to stress.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TypicalResults;
