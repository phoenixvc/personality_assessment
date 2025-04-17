import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';

interface PackageDetailParams {
  id: string;
}

interface PackageDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  version: string;
  author: string;
  authorWebsite: string;
  category: string;
  dependencies: Array<{
    id: string;
    name: string;
    version: string;
    isInstalled: boolean;
  }>;
  tools: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  screenshots: Array<{
    url: string;
    caption: string;
  }>;
  changelog: Array<{
    version: string;
    date: string;
    changes: string[];
  }>;
  isInstalled: boolean;
  isOfficial: boolean;
  lastUpdated: string;
  rating: number;
  downloadCount: number;
  reviews: Array<{
    user: string;
    date: string;
    rating: number;
    comment: string;
  }>;
}

const PackageDetail: React.FC = () => {
  const { id } = useParams<PackageDetailParams>();
  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [installStatus, setInstallStatus] = useState<'not_installed' | 'installing' | 'installed' | 'uninstalling'>('not_installed');

  useEffect(() => {
    // Simulate API fetch for package details
    setTimeout(() => {
      // This would be an API call in a real application
      if (id === 'ocean-core') {
        setPackageData({
          id: 'ocean-core',
          name: 'OCEAN Core Framework',
          description: 'The Big Five personality model core framework with trait analysis tools',
          longDescription: `The OCEAN Core Framework provides a comprehensive implementation of the Big Five personality model (also known as the Five-Factor Model or FFM). This package includes the complete trait structure with all 30 facets, assessment tools, scoring algorithms, and visualization components.

The Big Five model is one of the most scientifically validated and widely used personality frameworks in psychology. It measures five broad dimensions of personality:

- Openness to Experience: Reflects curiosity, creativity, and preference for variety
- Conscientiousness: Reflects organization, responsibility, and goal-directed behavior
- Extraversion: Reflects sociability, assertiveness, and positive emotionality
- Agreeableness: Reflects compassion, cooperation, and trust towards others
- Neuroticism: Reflects emotional instability, anxiety, and negative emotionality

This package serves as the foundation for many other personality analysis tools and is required for most framework comparison features.`,
          version: '1.2.0',
          author: 'OCEAN Personality Dynamics',
          authorWebsite: 'https://oceanpersonality.org',
          category: 'frameworks',
          dependencies: [],
          tools: [
            {
              id: 'trait-analysis',
              name: 'Trait Analysis',
              description: 'Analyze individual traits and their interactions',
              icon: 'chart-bar'
            },
            {
              id: 'facet-breakdown',
              name: 'Facet Breakdown',
              description: 'Detailed analysis of the six facets within each trait',
              icon: 'sitemap'
            },
            {
              id: 'career-matching',
              name: 'Career Matching',
              description: 'Match personality traits to suitable career paths',
              icon: 'briefcase'
            },
            {
              id: 'relationship-compatibility',
              name: 'Relationship Compatibility',
              description: 'Analyze personality compatibility in relationships',
              icon: 'users'
            }
          ],
          screenshots: [
            {
              url: '/assets/screenshots/ocean-core-1.jpg',
              caption: 'Trait Analysis Dashboard'
            },
            {
              url: '/assets/screenshots/ocean-core-2.jpg',
              caption: 'Facet Breakdown Visualization'
            },
            {
              url: '/assets/screenshots/ocean-core-3.jpg',
              caption: 'Career Matching Tool'
            }
          ],
          changelog: [
            {
              version: '1.2.0',
              date: '2025-03-15',
              changes: [
                'Added new visualization options for trait interactions',
                'Improved scoring algorithm accuracy',
                'Updated normative data with 2024 research findings',
                'Fixed bug in facet calculation for conscientiousness'
              ]
            },
            {
              version: '1.1.0',
              date: '2024-11-22',
              changes: [
                'Added career matching tool',
                'Improved relationship compatibility analysis',
                'Enhanced data export options',
                'Fixed several UI issues on mobile devices'
              ]
            },
            {
              version: '1.0.0',
              date: '2024-08-05',
              changes: [
                'Initial release',
                'Core trait analysis functionality',
                'Basic facet breakdown visualization',
                'Research database integration'
              ]
            }
          ],
          isInstalled: true,
          isOfficial: true,
          lastUpdated: '2025-03-15',
          rating: 4.8,
          downloadCount: 12450,
          reviews: [
            {
              user: 'PsychResearcher',
              date: '2025-04-01',
              rating: 5,
              comment: 'Excellent implementation of the Big Five model. The facet breakdown is particularly useful for research purposes.'
            },
            {
              user: 'CareerCoach22',
              date: '2025-03-20',
              rating: 5,
              comment: 'The career matching tool is incredibly accurate and helpful for my clients.'
            },
            {
              user: 'DataScientist',
              date: '2025-03-18',
              rating: 4,
              comment: 'Great package overall, but I would like to see more advanced statistical analysis options.'
            }
          ]
        });
        setInstallStatus('installed');
      } else {
        // Default fallback for other packages
        setPackageData({
          id: id || 'unknown',
          name: 'Package Not Found',
          description: 'The requested package could not be found',
          longDescription: 'No additional information available.',
          version: 'N/A',
          author: 'Unknown',
          authorWebsite: '',
          category: 'unknown',
          dependencies: [],
          tools: [],
          screenshots: [],
          changelog: [],
          isInstalled: false,
          isOfficial: false,
          lastUpdated: 'N/A',
          rating: 0,
          downloadCount: 0,
          reviews: []
        });
      }
      setLoading(false);
    }, 800);
  }, [id]);

  const handleInstall = () => {
    if (installStatus === 'not_installed') {
      setInstallStatus('installing');
      // Simulate installation process
      setTimeout(() => {
        setInstallStatus('installed');
        if (packageData) {
          setPackageData({...packageData, isInstalled: true});
        }
      }, 1500);
    } else if (installStatus === 'installed') {
      setInstallStatus('uninstalling');
      // Simulate uninstallation process
      setTimeout(() => {
        setInstallStatus('not_installed');
        if (packageData) {
          setPackageData({...packageData, isInstalled: false});
        }
      }, 1500);
    }
  };

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i}
            className={`text-sm ${
              i < fullStars 
                ? 'fas fa-star text-yellow-400' 
                : i === fullStars && hasHalfStar 
                  ? 'fas fa-star-half-alt text-yellow-400' 
                  : 'far fa-star text-gray-300'
            }`}
          ></i>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Package Not Found</h2>
        <p className="mb-4">The requested package could not be loaded.</p>
        <Link to="/packages" className="text-blue-500 hover:underline">
          Return to Package List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/packages" className="text-blue-500 hover:underline flex items-center mr-4">
          <i className="fas fa-arrow-left mr-2"></i> Back to Packages
        </Link>
        <h2 className="text-3xl font-bold">{packageData.name}</h2>
        {packageData.isOfficial && (
          <span className="ml-4 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            <i className="fas fa-check-circle mr-1"></i> Official
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <p className="text-lg text-gray-700 mb-6">{packageData.description}</p>
            
            <Tab.Group>
              <Tab.List className="flex border-b">
                <Tab className={({ selected }) => `px-4 py-2 font-medium ${
                  selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  Overview
                </Tab>
                <Tab className={({ selected }) => `px-4 py-2 font-medium ${
                  selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  Tools
                </Tab>
                <Tab className={({ selected }) => `px-4 py-2 font-medium ${
                  selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  Screenshots
                </Tab>
                <Tab className={({ selected }) => `px-4 py-2 font-medium ${
                  selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  Changelog
                </Tab>
                <Tab className={({ selected }) => `px-4 py-2 font-medium ${
                  selected ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  Reviews
                </Tab>
              </Tab.List>
              
              <Tab.Panels className="mt-4">
                <Tab.Panel>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{packageData.longDescription}</p>
                  </div>
                </Tab.Panel>
                
                <Tab.Panel>
                  <div className="grid md:grid-cols-2 gap-4">
                    {packageData.tools.map(tool => (
                      <div key={tool.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <i className={`fas fa-${tool.icon} text-blue-600`}></i>
                          </div>
                          <h4 className="text-lg font-semibold">{tool.name}</h4>
                        </div>
                        <p className="text-gray-600">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
                
                <Tab.Panel>
                  <div className="grid md:grid-cols-2 gap-6">
                    {packageData.screenshots.map((screenshot, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <i className="fas fa-image text-gray-400 text-4xl"></i>
                          {/* In a real app, this would be an actual image */}
                          {/* <img src={screenshot.url} alt={screenshot.caption} className="w-full h-full object-cover" /> */}
                        </div>
                        <div className="p-3 text-center text-sm text-gray-600">
                          {screenshot.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
                
                <Tab.Panel>
                  <div className="space-y-6">
                    {packageData.changelog.map((release, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold">Version {release.version}</h4>
                          <span className="text-sm text-gray-500">{release.date}</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          {release.changes.map((change, changeIndex) => (
                            <li key={changeIndex} className="text-gray-700">{change}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
                
                <Tab.Panel>
                  <div className="space-y-6">
                    {packageData.reviews.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No reviews yet.</p>
                    ) : (
                      packageData.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="font-semibold">{review.user}</span>
                              <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                            </div>
                            {renderStarRating(review.rating)}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    )}
                    
                    <div className="pt-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Write a Review
                      </button>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Package Info</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                packageData.category === 'frameworks' ? 'bg-blue-100 text-blue-700' :
                packageData.category === 'tools' ? 'bg-green-100 text-green-700' :
                packageData.category === 'visualizations' ? 'bg-purple-100 text-purple-700' :
                packageData.category === 'integrations' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {packageData.category.charAt(0).toUpperCase() + packageData.category.slice(1)}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="font-medium">{packageData.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span className="font-medium">{packageData.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Author</span>
                <a 
                  href={packageData.authorWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-500 hover:underline"
                >
                  {packageData.author}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Downloads</span>
                <span className="font-medium">{packageData.downloadCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rating</span>
                {renderStarRating(packageData.rating)}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tools</span>
                <span className="font-medium">{packageData.tools.length}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <button 
                className={`w-full py-2 rounded transition-colors ${
                  installStatus === 'installing' || installStatus === 'uninstalling'
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : installStatus === 'installed'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={handleInstall}
                disabled={installStatus === 'installing' || installStatus === 'uninstalling'}
              >
                {installStatus === 'installing' ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Installing...</>
                ) : installStatus === 'uninstalling' ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Uninstalling...</>
                ) : installStatus === 'installed' ? (
                  'Uninstall'
                ) : (
                  'Install'
                )}
              </button>
            </div>
          </div>
          
          {packageData.dependencies.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Dependencies</h3>
              <ul className="space-y-2">
                {packageData.dependencies.map((dep, index) => (
                  <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <Link to={`/package/${dep.id}`} className="text-blue-500 hover:underline">
                      {dep.name} <span className="text-xs text-gray-500">v{dep.version}</span>
                    </Link>
                    {dep.isInstalled ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Installed
                      </span>
                    ) : (
                      <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Install
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Related Packages</h3>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-50 rounded">
                <Link to="/package/ocean-facets" className="text-blue-500 hover:underline">
                  OCEAN Facet Analysis
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded">
                <Link to="/package/framework-correlations" className="text-blue-500 hover:underline">
                  Framework Correlations
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded">
                <Link to="/package/3d-trait-visualization" className="text-blue-500 hover:underline">
                  3D Trait Visualization
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
