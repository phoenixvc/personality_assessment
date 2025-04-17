import React from 'react';

const PersonaProfile: React.FC = () => {
  return (
    <section id="persona-profile" className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Persona Profile</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 profile-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">John Doe</h3>
            <p className="text-gray-600 mb-4">A creative thinker with a passion for innovation and problem-solving.</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Enjoys working on challenging projects</li>
              <li>Strong analytical skills</li>
              <li>Excellent team player</li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 profile-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Jane Smith</h3>
            <p className="text-gray-600 mb-4">A detail-oriented professional with a knack for organization and efficiency.</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Highly organized and efficient</li>
              <li>Strong attention to detail</li>
              <li>Excellent time management skills</li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 profile-card transition-transform duration-200 ease-in-out transform hover:translate-y-1">
          <div className="content">
            <h3 className="text-xl font-bold mb-4">Michael Johnson</h3>
            <p className="text-gray-600 mb-4">A dynamic leader with a talent for motivating and inspiring teams.</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Strong leadership skills</li>
              <li>Excellent communication abilities</li>
              <li>Proven track record of success</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6">Experience Suggestions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-2">Creative Workshops</h4>
            <p className="text-sm text-gray-600">Participate in workshops to enhance creativity and innovation skills.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-2">Team Building Activities</h4>
            <p className="text-sm text-gray-600">Engage in activities that promote teamwork and collaboration.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-2">Leadership Training</h4>
            <p className="text-sm text-gray-600">Attend training sessions to develop leadership and management skills.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonaProfile;
