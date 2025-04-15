import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">&copy; 2023 OCEAN Personality Dynamics. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="transition-colors duration-300 ease-in-out hover:text-blue-500">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" className="transition-colors duration-300 ease-in-out hover:text-blue-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" className="transition-colors duration-300 ease-in-out hover:text-pink-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" className="transition-colors duration-300 ease-in-out hover:text-blue-700">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
