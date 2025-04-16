import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface PackageInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  dependencies: string[];
  toolCount: number;
  isInstalled: boolean;
  isOfficial: boolean;
  lastUpdated: string;
  rating: number;
  downloadCount: number;
}

interface PackageCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const PackageWorkspaces: React.FC = () => {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterInstalled, setFilterInstalled] = useState<boolean>(false);
  const [filterOfficial, setFilterOfficial] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const categories: PackageCategory[] = [
    { id: 'all', name: 'All Packages', description: 'All available workspace packages', icon: 'box' },
    { id: 'frameworks', name: 'Personality Frameworks', description: 'Core personality assessment frameworks', icon: 'brain' },
    { id: 'tools', name: 'Analysis Tools', description: 'Tools for analyzing personality data', icon: 'tools' },
    { id: 'visualizations', name: 'Visualizations', description: 'Data visualization components', icon: 'chart-pie' },
    { id: 'integrations', name: 'Integrations', description: 'Connect with external services and data sources', icon: 'plug' },
    { id: 'research', name: 'Research', description: 'Academic research and studies', icon: 'flask' }
  ];

  // Sample package data
  const samplePackages: PackageInfo[] = [
    {
      id: 'ocean-core',
      name: 'OCEAN Core Framework',
      description: 'The Big Five personality model core framework with trait analysis tools',
      version: '1.2.0',
      author: 'OCEAN Personality Dynamics',
      category: 'frameworks',
      dependencies: [],
      toolCount: 4,
      isInstalled: true,
      isOfficial: true,
      lastUpdated: '2025-03-15',
      rating: 4.8,
      downloadCount: 12450
    },
    {
      id: 'ocean-facets',
      name: 'OCEAN Facet Analysis',
      description: 'Detailed analysis of the 30 facets within the Big Five traits',
      version: '1.0.5',
      author: 'OCEAN Personality Dynamics',
      category: 'tools',
      dependencies: ['ocean-core'],
      toolCount: 2,
      isInstalled: true,
      isOfficial: true,
      lastUpdated: '2025-02-28',
      rating: 4.6,
      downloadCount: 8320
    },
    {
      id: 'mbti-core',
      name: 'MBTI Framework',
      description: 'Myers-Briggs Type Indicator framework with 16 personality types',
      version: '2.1.0',
      author: 'OCEAN Personality Dynamics',
      category: 'frameworks',
      dependencies: [],
      toolCount: 4,
      isInstalled: true,
      isOfficial: true,
      lastUpdated: '2025-03-10',
      rating: 4.7,
      downloadCount: 10850
    },
    {
      id: 'mbti-cognitive',
      name: 'MBTI Cognitive Functions',
      description: 'Analysis of the eight cognitive functions in the MBTI framework',
      version: '1.3.2',
      author: 'Cognitive Insights Lab',
      category: 'tools',
      dependencies: ['mbti-core'],
      toolCount: 3,
      isInstalled: false,
      isOfficial: false,
      lastUpdated: '2025-01-20',
      rating: 4.5,
      downloadCount: 7650
    },
    {
      id: 'disc-core',
      name: 'DISC Assessment Framework',
      description: 'DISC personality assessment framework and behavioral analysis',
      version: '1.8.0',
      author: 'OCEAN Personality Dynamics',
      category: 'frameworks',
      dependencies: [],
      toolCount: 4,
      isInstalled: false,
      isOfficial: true,
      lastUpdated: '2025-02-05',
      rating: 4.6,
      downloadCount: 9120
    },
    {
      id: 'enneagram-core',
      name: 'Enneagram Framework',
      description: 'Enneagram personality system with nine interconnected types',
      version: '2.0.1',
      author: 'OCEAN Personality Dynamics',
      category: 'frameworks',
      dependencies: [],
      toolCount: 5,
      isInstalled: false,
      isOfficial: true,
      lastUpdated: '2025-03-22',
      rating: 4.7,
      downloadCount: 8750
    },
    {
      id: 'framework-correlations',
      name: 'Framework Correlations',
      description: 'Tools to analyze correlations between different personality frameworks',
      version: '1.4.0',
      author: 'OCEAN Personality Dynamics',
      category: 'tools',
      dependencies: ['ocean-core'],
      toolCount: 2,
      isInstalled: true,
      isOfficial: true,
      lastUpdated: '2025-02-18',
      rating: 4.9,
      downloadCount: 11200
    },
    {
      id: 'career-matcher',
      name: 'Career Path Matcher',
      description: 'Match personality profiles with suitable career paths and job roles',
      version: '2.2.1',
      author: 'Career Insights Inc.',
      category: 'tools',
      dependencies: ['ocean-core', 'mbti-core'],
      toolCount: 3,
      isInstalled: true,
      isOfficial: false,
      lastUpdated: '2025-01-30',
      rating: 4.8,
      downloadCount: 14500
    },
    {
      id: 'relationship-dynamics',
      name: 'Relationship Dynamics',
      description: 'Analyze personality compatibility and dynamics in relationships',
      version: '1.6.3',
      author: 'Relationship Science Lab',
      category: 'tools',
      dependencies: ['ocean-core', 'mbti-core'],
      toolCount: 4,
      isInstalled: false,
      isOfficial: false,
      lastUpdated: '2025-02-12',
      rating: 4.7,
      downloadCount: 9850
    },
    {
      id: '3d-trait-visualization',
      name: '3D Trait Visualization',
      description: 'Interactive 3D visualizations of personality traits and their relationships',
      version: '1.2.0',
      author: 'DataViz Solutions',
      category: 'visualizations',
      dependencies: ['ocean-core'],
      toolCount: 2,
      isInstalled: false,
      isOfficial: false,
      lastUpdated: '2025-01-15',
      rating: 4.5,
      downloadCount: 6200
    },
    {
      id: 'team-dynamics',
      name: 'Team Dynamics Analysis',
      description: 'Analyze team composition and optimize group dynamics based on personality',
      version: '2.0.0',
      author: 'Organizational Psychology Lab',
      category: 'tools',
      dependencies: ['ocean-core', 'disc-core'],
      toolCount: 3,
      isInstalled: false,
      isOfficial: false,
      lastUpdated: '2025-03-05',
      rating: 4.8,
      downloadCount: 8900
    },
    {
      id: 'google-calendar-integration',
      name: 'Google Calendar Integration',
      description: 'Integrate personality insights with Google Calendar for productivity optimization',
      version: '1.0.2',
      author: 'Productivity Plus',
      category: 'integrations',
      dependencies: ['ocean-core'],
      toolCount: 1,
      isInstalled: false,
      isOfficial: false,
      lastUpdated: '2025-02-20',
      rating: 4.2,
      downloadCount: 3400
    },
    {
      id: 'research-database',
      name: 'Personality Research Database',
      description: 'Access to academic studies and research papers on personality psychology',
      version: '2.1.0',
      author: 'Academic Research Consortium',
      category: 'research',
      dependencies: [],
      toolCount: 2,
      isInstalled: true,
      isOfficial: false,
      lastUpdated: '2025-03-18',
      rating: 4.9,
      downloadCount: 7200
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPackages(samplePackages);
      setFilteredPackages(samplePackages);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Filter and sort packages based on current criteria
    let filtered = [...packages];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(query) || 
        pkg.description.toLowerCase().includes(query)
      );
    }
    
    // Apply installed filter
    if (filterInstalled) {
      filtered = filtered.filter(pkg => pkg.isInstalled);
    }
    
    // Apply official filter
    if (filterOfficial) {
      filtered = filtered.filter(pkg => pkg.isOfficial);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredPackages(filtered);
  }, [packages, selectedCategory, searchQuery, sortBy, filterInstalled, filterOfficial]);

  const toggleInstallPackage = (packageId: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === packageId ? { ...pkg, isInstalled: !pkg.isInstalled } : pkg
    ));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Workspace Packages</h2>
      <p className="text-gray-600 mb-8">
        Extend your personality analysis toolkit with these packages and workspaces
      </p>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    className={`w-full text-left p-2 rounded transition-colors flex items-center ${
                      selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <i className={`fas fa-${category.icon} w-6`}></i>
                    <span>{category.name}</span>
                    <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {packages.filter(pkg => category.id === 'all' || pkg.category === category.id).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold mb-4">Filters</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Sort By</label>
              <select
                className="w-full p-2 border rounded"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="downloads">Downloads</option>
                <option value="updated">Last Updated</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterInstalled}
                  onChange={() => setFilterInstalled(!filterInstalled)}
                  className="mr-2"
                />
                <span>Installed Only</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterOfficial}
                  onChange={() => setFilterOfficial(!filterOfficial)}
                  className="mr-2"
                />
                <span>Official Packages</span>
              </label>
            </div>
            
            <div className="mt-4">
              <button 
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSortBy('name');
                  setFilterInstalled(false);
                  setFilterOfficial(false);
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border rounded"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">{filteredPackages.length} packages found</span>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <i className="fas fa-sync-alt mr-2"></i> Check for Updates
                </button>
              </div>
            </div>
          </div>
          
          {filteredPackages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <i className="fas fa-box-open text-gray-400 text-5xl mb-4"></i>
              <h3 className="text-xl font-bold mb-2">No packages found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPackages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pkg.category === 'frameworks' ? 'bg-blue-100 text-blue-700' :
                      pkg.category === 'tools' ? 'bg-green-100 text-green-700' :
                      pkg.category === 'visualizations' ? 'bg-purple-100 text-purple-700' :
                      pkg.category === 'integrations' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Version:</span> {pkg.version}
                    </div>
                    <div>
                      <span className="text-gray-500">Tools:</span> {pkg.toolCount}
                    </div>
                    <div>
                      <span className="text-gray-500">Author:</span> {pkg.author}
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span> {pkg.lastUpdated}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    {renderStarRating(pkg.rating)}
                    <span className="text-sm text-gray-600">
                      <i className="fas fa-download mr-1"></i> {pkg.downloadCount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t flex justify-between items-center">
                    <div>
                      {pkg.isOfficial && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          <i className="fas fa-check-circle mr-1"></i> Official
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/package/${pkg.id}`}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        Details
                      </Link>
                      
                      <button 
                        className={`px-3 py-1 rounded transition-colors ${
                          pkg.isInstalled 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        onClick={() => toggleInstallPackage(pkg.id)}
                      >
                        {pkg.isInstalled ? 'Uninstall' : 'Install'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Create Your Own Package</h3>
            <p className="text-gray-600 mb-4">
              Have a unique personality assessment tool or framework? Create and share your own package with the community.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/create-package"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i> Create Package
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageWorkspaces;