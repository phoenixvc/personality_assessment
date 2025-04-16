import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">OCEAN Personality Dynamics</div>
        <nav className="space-x-4">
          <a href="#overview" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Overview</a>
          <a href="#interactive" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Interactive</a>
          <a href="#combinations" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Combinations</a>
          <a href="#assessment" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Assessment</a>
          <a href="#quiz" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Quiz</a>
          <a href="#persona-profile" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Persona Profile</a>
          <a href="#ai-interaction" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">AI Interaction</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
