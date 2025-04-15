import React, { useState } from 'react';

const Assessment: React.FC = () => {
  const [openness, setOpenness] = useState(50);
  const [conscientiousness, setConscientiousness] = useState(50);
  const [extraversion, setExtraversion] = useState(50);
  const [agreeableness, setAgreeableness] = useState(50);
  const [neuroticism, setNeuroticism] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section id="assessment" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Personality Assessment</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label htmlFor="openness" className="block text-gray-700 font-bold mb-2">Openness</label>
          <input
            type="range"
            id="openness"
            name="openness"
            min="0"
            max="100"
            value={openness}
            onChange={(e) => setOpenness(Number(e.target.value))}
            className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="conscientiousness" className="block text-gray-700 font-bold mb-2">Conscientiousness</label>
          <input
            type="range"
            id="conscientiousness"
            name="conscientiousness"
            min="0"
            max="100"
            value={conscientiousness}
            onChange={(e) => setConscientiousness(Number(e.target.value))}
            className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="extraversion" className="block text-gray-700 font-bold mb-2">Extraversion</label>
          <input
            type="range"
            id="extraversion"
            name="extraversion"
            min="0"
            max="100"
            value={extraversion}
            onChange={(e) => setExtraversion(Number(e.target.value))}
            className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="agreeableness" className="block text-gray-700 font-bold mb-2">Agreeableness</label>
          <input
            type="range"
            id="agreeableness"
            name="agreeableness"
            min="0"
            max="100"
            value={agreeableness}
            onChange={(e) => setAgreeableness(Number(e.target.value))}
            className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="neuroticism" className="block text-gray-700 font-bold mb-2">Neuroticism</label>
          <input
            type="range"
            id="neuroticism"
            name="neuroticism"
            min="0"
            max="100"
            value={neuroticism}
            onChange={(e) => setNeuroticism(Number(e.target.value))}
            className="w-full trait-slider transition-transform duration-200 ease-in-out transform hover:scale-105"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default Assessment;
