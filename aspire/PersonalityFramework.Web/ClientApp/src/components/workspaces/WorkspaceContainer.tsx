import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface WorkspaceParams {
  id: string;
}

interface WorkspaceTool {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
}

const WorkspaceContainer: React.FC = () => {
  const { id } = useParams<WorkspaceParams>();
  const [workspaceData, setWorkspaceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real application, this would fetch from an API
    const fetchWorkspaceData = async () => {
      try {
        // For demo purposes, we'll import the JSON directly
        let data;
        
        if (id === 'ocean') {
          data = await import('../../workspaces/OceanWorkspace.json');
        } else if (id === 'mbti') {
          data = await import('../../workspaces/MbtiWorkspace.json');
        } else {
          // Default fallback
          data = { error: "Workspace not found" };
        }
        
        setWorkspaceData(data);
        
        // Set the first tool as active by default if tools exist
        if (data.tools && data.tools.length > 0) {
          setActiveToolId(data.tools[0].id);
        }
        
      } catch (error) {
        console.error("Error loading workspace data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkspaceData();
  }, [id]);
  
  // Placeholder for workspace tools
  const renderWorkspaceTool = (toolId: string) => {
    // In a real application, this would render the actual tool component
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">
          {workspaceData?.tools?.find((tool: any) => tool.id === toolId)?.name || "Tool"}
        </h3>
        <p className="text-gray-600 mb-4">
          {workspaceData?.tools?.find((tool: any) => tool.id === toolId)?.description || "Tool description"}
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
          Tool interface would be rendered here
        </div>
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
  
  if (!workspaceData || workspaceData.error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Workspace Not Found</h2>
        <p className="mb-4">The requested workspace could not be loaded.</p>
        <Link to="/workspaces" className="text-blue-500 hover:underline">
          Return to Workspace Selector
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/workspaces" className="text-blue-500 hover:underline flex items-center">
            <i className="fas fa-arrow-left mr-2"></i> Back to Workspaces
          </Link>
          <h2 className="text-3xl font-bold mt-2">{workspaceData.name}</h2>
          <p className="text-gray-600">{workspaceData.description}</p>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            <i className="fas fa-save mr-2"></i> Save Workspace
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
            <i className="fas fa-share-alt mr-2"></i> Share
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Tools</h3>
            <ul className="space-y-2">
              {workspaceData.tools?.map((tool: any) => (
                <li key={tool.id}>
                  <button
                    className={`w-full text-left p-2 rounded transition-colors ${
                      activeToolId === tool.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveToolId(tool.id)}
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-bold mt-6 mb-4 border-b pb-2">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                  <i className="fas fa-book mr-2 text-gray-500"></i> Documentation
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                  <i className="fas fa-graduation-cap mr-2 text-gray-500"></i> Tutorials
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                  <i className="fas fa-file-alt mr-2 text-gray-500"></i> Research Papers
                </button>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 mt-6">
            <h3 className="text-lg font-bold mb-4">Framework Information</h3>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <span className="font-semibold">Version:</span> {workspaceData.version}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Author:</span> {workspaceData.author}
              </p>
              <p>
                <a href="#" className="text-blue-500 hover:underline">View framework details</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-9">
          {activeToolId && renderWorkspaceTool(activeToolId)}
          
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Recent Analysis</h3>
              <ul className="space-y-2">
                <li className="p-2 hover:bg-gray-50 rounded flex justify-between">
                  <span>Personal Profile Analysis</span>
                  <span className="text-gray-500">Apr 15, 2025</span>
                </li>
                <li className="p-2 hover:bg-gray-50 rounded flex justify-between">
                  <span>Team Compatibility Report</span>
                  <span className="text-gray-500">Apr 12, 2025</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Recommended Resources</h3>
              <ul className="space-y-2">
                {workspaceData.research?.key_studies?.slice(0, 2).map((study: any, index: number) => (
                  <li key={index} className="p-2 hover:bg-gray-50 rounded">
                    <p className="font-medium">{study.title}</p>
                    <p className="text-sm text-gray-600">{study.authors} ({study.year})</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceContainer;