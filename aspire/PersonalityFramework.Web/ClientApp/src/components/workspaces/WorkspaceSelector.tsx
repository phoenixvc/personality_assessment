import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface WorkspaceOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

const WorkspaceSelector: React.FC = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  
  const workspaces: WorkspaceOption[] = [
    {
      id: 'ocean',
      name: 'Big Five (OCEAN)',
      description: 'Analyze the five major personality dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
      icon: 'chart-radar',
      color: 'blue',
      features: [
        'Trait Analysis',
        'Facet Breakdown',
        'Career Matching',
        'Relationship Compatibility'
      ]
    },
    {
      id: 'mbti',
      name: 'Myers-Briggs (MBTI)',
      description: 'Explore the 16 personality types based on preferences for Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.',
      icon: 'puzzle-piece',
      color: 'green',
      features: [
        'Type Identifier',
        'Cognitive Functions Analysis',
        'Career Guidance',
        'Relationship Dynamics'
      ]
    },
    {
      id: 'disc',
      name: 'DISC Assessment',
      description: 'Understand behavioral patterns across four dimensions: Dominance, Influence, Steadiness, and Conscientiousness.',
      icon: 'chart-pie',
      color: 'yellow',
      features: [
        'Behavioral Style Analysis',
        'Communication Preferences',
        'Team Role Matcher',
        'Leadership Style Insights'
      ]
    },
    {
      id: 'enneagram',
      name: 'Enneagram',
      description: 'Explore the nine interconnected personality types and their relationships.',
      icon: 'circle-nodes',
      color: 'red',
      features: [
        'Type Identification',
        'Wing Analysis',
        'Growth & Stress Patterns',
        'Instinctual Variants'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Personality Framework Workspaces</h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Select a workspace to access specialized tools and insights for your preferred personality framework. 
        Each workspace provides framework-specific analysis, visualizations, and resources.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workspaces.map((workspace) => (
          <div 
            key={workspace.id}
            className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              selectedWorkspace === workspace.id ? `ring-4 ring-${workspace.color}-500` : ''
            }`}
            onClick={() => setSelectedWorkspace(workspace.id)}
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-${workspace.color}-100 rounded-full flex items-center justify-center`}>
              <i className={`fas fa-${workspace.icon} text-${workspace.color}-600 text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">{workspace.name}</h3>
            <p className="text-gray-600 text-center mb-4">{workspace.description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-2 text-center">Features</h4>
              <ul className="text-sm text-gray-600">
                {workspace.features.map((feature, index) => (
                  <li key={index} className="mb-1 flex items-center justify-center">
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Link 
                to={`/workspace/${workspace.id}`}
                className={`px-4 py-2 rounded-lg bg-${workspace.color}-500 text-white hover:bg-${workspace.color}-600 transition-colors duration-300`}
              >
                Open Workspace
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Compare Frameworks</h3>
        <p className="text-gray-600 mb-4">
          Need to translate between frameworks or understand how they relate to each other? 
          Use our Combination Analysis Tools to compare and correlate different personality frameworks.
        </p>
        <div className="flex justify-center">
          <Link 
            to="/combination-analysis"
            className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-300"
          >
            Open Combination Analysis
          </Link>
        </div>
      </div>
      
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <p className="text-gray-600 mb-4">Continue where you left off with your recent workspaces:</p>
          <ul className="space-y-2">
            {/* This would be populated dynamically based on user history */}
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span>OCEAN Analysis - Apr 12, 2025</span>
              <Link to="/workspace/ocean" className="text-blue-500 hover:underline">Resume</Link>
            </li>
            <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span>MBTI Exploration - Apr 10, 2025</span>
              <Link to="/workspace/mbti" className="text-blue-500 hover:underline">Resume</Link>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Create Custom Workspace</h3>
          <p className="text-gray-600 mb-4">
            Build your own workspace by selecting tools and visualizations from different frameworks.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/custom-workspace"
              className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
            >
              Create Custom Workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelector;