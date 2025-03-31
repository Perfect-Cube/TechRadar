import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Technology, Project } from "@shared/schema";

interface ProjectListProps {
  selectedTechnology: Technology | null;
}

export default function ProjectList({ selectedTechnology }: ProjectListProps) {
  // Fetch projects for the selected technology
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: selectedTechnology ? [`/api/technologies/${selectedTechnology.id}/projects`] : ['no-query'],
    queryFn: async () => {
      if (!selectedTechnology) return [];
      const response = await fetch(`/api/technologies/${selectedTechnology.id}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    },
    enabled: !!selectedTechnology, // Only run the query when a technology is selected
  });

  if (!selectedTechnology) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold mb-4">Related Projects</h2>
        <p className="text-slate-500">Select a technology to see related projects</p>
      </div>
    );
  }

  // Ensure projects is always an array for type safety
  const projectsList = Array.isArray(projects) ? projects : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-4">Projects Using {selectedTechnology.name}</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading projects</div>
      ) : projectsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectsList.map((project: Project) => (
            <div key={project.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {project.image && (
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : project.status === 'completed' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3">{project.description}</p>
                <div className="flex items-center space-x-3 text-sm">
                  {project.website && (
                    <a 
                      href={project.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Website
                    </a>
                  )}
                  {project.repository && (
                    <a 
                      href={project.repository} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Repository
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No projects are currently using this technology</p>
      )}
    </div>
  );
}