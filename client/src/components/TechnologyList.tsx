import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Technology, Quadrant, Ring } from "@shared/schema";
import { getQuadrantBgClass, getRingBgClass } from "@/lib/radar-data";

export default function TechnologyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("all");
  const [selectedRing, setSelectedRing] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const itemsPerPage = 7;

  const { data: technologies = [], isLoading: techsLoading } = useQuery<Technology[]>({ 
    queryKey: ['/api/technologies'],
  });

  const { data: quadrants = [], isLoading: quadrantsLoading } = useQuery<Quadrant[]>({ 
    queryKey: ['/api/quadrants'],
  });

  const { data: rings = [], isLoading: ringsLoading } = useQuery<Ring[]>({ 
    queryKey: ['/api/rings'],
  });

  const isLoading = techsLoading || quadrantsLoading || ringsLoading;

  // Filter technologies based on search, quadrant, and ring
  const filteredTechnologies = technologies.filter((tech: Technology) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuadrant = selectedQuadrant === "all" || tech.quadrant === parseInt(selectedQuadrant);
    const matchesRing = selectedRing === "all" || tech.ring === parseInt(selectedRing);
    return matchesSearch && matchesQuadrant && matchesRing;
  });

  // Get paginated technologies
  const paginatedTechnologies = filteredTechnologies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredTechnologies.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedQuadrant, selectedRing]);

  // Handle technology selection
  const handleTechSelect = (tech: Technology) => {
    setSelectedTech(tech);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 p-6 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold mb-2 md:mb-0 dark:text-white">All Technologies</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-64">
            <input 
              type="search" 
              placeholder="Filter technologies..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 dark:placeholder-gray-400" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-400 dark:text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <select 
            className="border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
            value={selectedQuadrant}
            onChange={(e) => setSelectedQuadrant(e.target.value)}
          >
            <option value="all">All Quadrants</option>
            {quadrants?.map((quadrant: Quadrant, index: number) => (
              <option key={quadrant.id} value={index}>{quadrant.name}</option>
            ))}
          </select>
          <select 
            className="border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
            value={selectedRing}
            onChange={(e) => setSelectedRing(e.target.value)}
          >
            <option value="all">All Rings</option>
            {rings?.map((ring: Ring, index: number) => (
              <option key={ring.id} value={index}>{ring.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
              <thead className="bg-slate-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-300 uppercase tracking-wider">Quadrant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-300 uppercase tracking-wider">Ring</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-200 dark:divide-gray-700">
                {paginatedTechnologies.length > 0 ? (
                  paginatedTechnologies.map((tech: Technology) => (
                    <tr key={tech.id} className="hover:bg-slate-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                          onClick={() => handleTechSelect(tech)}
                        >
                          {tech.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getQuadrantBgClass(tech.quadrant)}`}>
                          {quadrants.find(q => q.id === tech.quadrant)?.name || `Quadrant ${tech.quadrant}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRingBgClass(tech.ring)}`}>
                          {rings.find(r => r.id === tech.ring)?.name || `Ring ${tech.ring}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 dark:text-gray-300">{tech.description}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500 dark:text-gray-400">
                      No technologies found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-500 dark:text-gray-400">
              {filteredTechnologies.length > 0 ? (
                <>
                  Showing <span className="font-medium dark:text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium dark:text-gray-300">
                    {Math.min(currentPage * itemsPerPage, filteredTechnologies.length)}
                  </span>{" "}
                  of <span className="font-medium dark:text-gray-300">{filteredTechnologies.length}</span> results
                </>
              ) : (
                "No results found"
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-1 rounded border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                
                {/* Generate page buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first page, last page, current page, and pages around current
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={`px-3 py-1 rounded border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 ${
                          currentPage === pageNum
                            ? "text-blue-600 dark:text-blue-400 font-medium"
                            : "text-slate-700 dark:text-gray-300"
                        } hover:bg-blue-50 dark:hover:bg-gray-600`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-slate-500 dark:text-gray-400">...</span>
                    <button
                      className={`px-3 py-1 rounded border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600`}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  className="px-3 py-1 rounded border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
