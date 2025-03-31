import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { Technology, Quadrant, Ring } from "@shared/schema";
import { 
  RING_COLORS, 
  RING_OPACITIES, 
  getRingColor, 
  getQuadrantAngle, 
  getRingBgClass,
  getQuadrantBgClass
} from "@/lib/radar-data";
import ProjectList from "./ProjectList";

// Create a simple type declaration file for this module
declare module 'd3';

export default function RadarVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Technology[] | null>(null);
  const [showProjectsList, setShowProjectsList] = useState(false);

  // Query to fetch technologies (with search param if present)
  const { 
    data: technologies = [], 
    isLoading: techsLoading,
    refetch: refetchTechnologies
  } = useQuery<Technology[]>({ 
    queryKey: ['/api/technologies', searchQuery],
    queryFn: async () => {
      const endpoint = searchQuery 
        ? `/api/technologies?q=${encodeURIComponent(searchQuery)}` 
        : '/api/technologies';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch technologies');
      }
      return response.json();
    }
  });

  const { 
    data: quadrants = [], 
    isLoading: quadrantsLoading 
  } = useQuery<Quadrant[]>({ 
    queryKey: ['/api/quadrants'],
  });

  const { 
    data: rings = [], 
    isLoading: ringsLoading 
  } = useQuery<Ring[]>({ 
    queryKey: ['/api/rings'],
  });

  const isLoading = techsLoading || quadrantsLoading || ringsLoading;

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchTechnologies();
    
    if (searchQuery && technologies) {
      const results = technologies.filter((tech: Technology) => 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.tags && tech.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  // Clear search results and query
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // Select a technology from search results
  const selectTechFromSearch = (tech: Technology) => {
    setSelectedTech(tech);
    setSearchResults(null); // Hide search results after selection
    
    // If the tech is in a different quadrant than the currently selected one,
    // update the quadrant filter to show it
    if (selectedQuadrant !== null && tech.quadrant !== selectedQuadrant) {
      setSelectedQuadrant(tech.quadrant);
    }
  };

  // Toggle showing projects list
  const toggleProjectsList = () => {
    setShowProjectsList(!showProjectsList);
  };

  useEffect(() => {
    if (isLoading || !svgRef.current || !containerRef.current) {
      return;
    }

    // Clear any existing SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = 500; // Fixed height as per design reference
    
    // Set svg dimensions
    svg
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Create a group and center it
    const g = svg.append("g")
      .attr("transform", `translate(${containerWidth / 2}, ${containerHeight / 2})`);

    // Calculate radius based on container size
    const radius = Math.min(containerWidth, containerHeight) / 2 - 40;

    // Define ring radiuses
    const ringRadii = [
      radius * 0.25, // Adopt
      radius * 0.5,  // Trial
      radius * 0.75, // Assess
      radius         // Hold
    ];

    // Draw rings
    rings.forEach((ring: Ring, i: number) => {
      const ringColor = ring.color || RING_COLORS[i];
      
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", ringRadii[i])
        .attr("fill", ringColor)
        .attr("fill-opacity", RING_OPACITIES[i])
        .attr("stroke", ringColor)
        .attr("stroke-width", 1);
      
      // Ring labels with dark mode support
      g.append("text")
        .attr("x", 5)
        .attr("y", -ringRadii[i] + 15)
        .attr("text-anchor", "start")
        .attr("fill", "#64748b")
        .attr("class", "dark:fill-gray-400")
        .attr("font-size", "11px")
        .text(ring.name);
    });

    // Define quadrant angles
    const quadrantAngles = quadrants.map((_: Quadrant, i: number) => getQuadrantAngle(i));

    // Draw quadrant lines
    quadrantAngles.forEach((angle: number, i: number) => {
      const quadrantColor = quadrants[i]?.color || "#64748b";
      const x2 = Math.cos(angle) * radius;
      const y2 = Math.sin(angle) * radius;
      
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", quadrantColor)
        .attr("stroke-width", 1);
      
      // Quadrant labels - positioned outside the circle
      const labelRadius = radius + 25; // Increased the distance from center
      // Calculate position based on the quadrant center angle
      const quadrantCenterAngle = angle + Math.PI / 4;
      const labelX = Math.cos(quadrantCenterAngle) * labelRadius;
      const labelY = Math.sin(quadrantCenterAngle) * labelRadius;
      
      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", quadrantCenterAngle < Math.PI ? "start" : "end")
        .attr("alignment-baseline", quadrantCenterAngle < Math.PI / 2 || quadrantCenterAngle > 3 * Math.PI / 2 ? "hanging" : "baseline")
        .attr("fill", quadrantColor)
        .attr("font-size", "14px") // Increased font size
        .attr("font-weight", "bold")
        .attr("class", "dark:fill-gray-300")
        .text(quadrants[i]?.name || "");
    });

    // Filter technologies by selected quadrant if any
    const filteredTechs = selectedQuadrant !== null 
      ? technologies.filter((tech: Technology) => tech.quadrant === selectedQuadrant)
      : technologies;
    
    // Plot technologies as dots
    filteredTechs.forEach((tech: Technology) => {
      const angle = quadrantAngles[tech.quadrant] + Math.PI / 4;
      const ringRadius = ringRadii[tech.ring];
      
      // Add some randomness within the quadrant and ring
      const randomAngleOffset = (Math.random() - 0.5) * Math.PI / 3;
      const randomRadiusScale = 0.7 + Math.random() * 0.3;
      
      const finalAngle = angle + randomAngleOffset;
      const finalRadius = ringRadius * randomRadiusScale;
      
      const x = Math.cos(finalAngle) * finalRadius;
      const y = Math.sin(finalAngle) * finalRadius;
      
      // Check if this technology is the selected one
      const isSelected = selectedTech && selectedTech.id === tech.id;
      
      // Technology dot with dark mode support
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", isSelected ? 7 : 5)
        .attr("fill", rings[tech.ring]?.color || RING_COLORS[tech.ring])
        .attr("stroke", isSelected ? "#000" : "#fff")
        .attr("stroke-width", isSelected ? 2 : 1)
        .attr("class", "dark:stroke-gray-800")
        .attr("cursor", "pointer")
        .on("mouseover", function(this: SVGCircleElement) {
          const isDarkMode = document.documentElement.classList.contains('dark');
          d3.select(this)
            .attr("r", 7)
            .attr("stroke", isDarkMode ? "#fff" : "#000");
        })
        .on("mouseout", function(this: SVGCircleElement) {
          if (!isSelected) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            d3.select(this)
              .attr("r", 5)
              .attr("stroke", isDarkMode ? "#333" : "#fff");
          }
        })
        .on("click", function() {
          setSelectedTech(tech);
        });
      
      // Technology label with dark mode support
      g.append("text")
        .attr("x", x + 8)
        .attr("y", y + 3)
        .attr("text-anchor", "start")
        .attr("fill", isSelected ? "#000" : "#1e293b")
        .attr("class", "dark:fill-gray-300")
        .attr("font-size", isSelected ? "12px" : "10px")
        .attr("font-weight", isSelected ? "600" : "500")
        .text(tech.name);
    });

  }, [isLoading, technologies, quadrants, rings, selectedQuadrant, selectedTech]);

  const handleQuadrantFilter = (quadrantId: number | null) => {
    setSelectedQuadrant(quadrantId);
  };

  return (
    <div className="bg-background radar-bg rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 container mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-bold mb-2 lg:mb-0">Technology Radar Visualization</h2>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          {/* Search component */}
          <form onSubmit={handleSearch} className="relative w-full lg:w-64">
            <input 
              type="search" 
              placeholder="Search technologies..." 
              className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Search results dropdown */}
            {searchResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-background dark:bg-gray-800 rounded-md shadow-lg border border-slate-200 dark:border-gray-700 max-h-60 overflow-auto">
                <ul className="py-1">
                  {searchResults.map((tech: Technology) => (
                    <li 
                      key={tech.id} 
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => selectTechFromSearch(tech)}
                    >
                      <div className="font-medium">{tech.name}</div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRingBgClass(tech.ring)}`}>
                          {rings && rings[tech.ring]?.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getQuadrantBgClass(tech.quadrant)}`}>
                          {quadrants && quadrants[tech.quadrant]?.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {searchResults && searchResults.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-background dark:bg-gray-800 rounded-md shadow-lg border border-slate-200 dark:border-gray-700">
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No technologies found</div>
              </div>
            )}
          </form>
          
          {/* Quadrant filter buttons */}
          <div className="flex flex-wrap gap-2">
            <button 
              className={`${selectedQuadrant === null ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-800'} px-3 py-1.5 rounded-full text-sm font-medium`}
              onClick={() => handleQuadrantFilter(null)}
            >
              All Quadrants
            </button>
            {quadrants.map((quadrant: Quadrant, index: number) => (
              <button 
                key={quadrant.id}
                className={`${selectedQuadrant === index ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-800'} px-3 py-1.5 rounded-full text-sm font-medium`}
                onClick={() => handleQuadrantFilter(index)}
              >
                {quadrant.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col lg:flex-row mb-6">
            <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
              <div ref={containerRef} className="w-full h-[500px] flex items-center justify-center">
                <svg ref={svgRef}></svg>
              </div>
            </div>
            <div className="w-full lg:w-1/3 lg:pl-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Selected Technology</h3>
                <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700 tech-card">
                  {selectedTech ? (
                    <div>
                      <div className="mb-2">
                        <h4 className="font-semibold text-lg">{selectedTech.name}</h4>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRingBgClass(selectedTech.ring)}`}>
                            {rings[selectedTech.ring]?.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getQuadrantBgClass(selectedTech.quadrant)}`}>
                            {quadrants[selectedTech.quadrant]?.name}
                          </span>
                          {selectedTech.tags && selectedTech.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{selectedTech.description}</p>
                      
                      {selectedTech.website && (
                        <div className="mb-2">
                          <a 
                            href={selectedTech.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit website
                          </a>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-gray-700 flex justify-between">
                        <a href={`/technologies?tech=${selectedTech.id}`} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300">
                          View full details →
                        </a>
                        <button 
                          onClick={toggleProjectsList}
                          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                        >
                          Related Projects
                          <svg className={`w-4 h-4 ml-1 transform ${showProjectsList ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Click on a technology in the radar to see details</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Legend</h3>
                <div className="space-y-2">
                  {rings.map((ring: Ring, index: number) => (
                    <div key={ring.id} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: ring.color || RING_COLORS[index] }}
                      ></div>
                      <span className="text-sm">{ring.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Projects List */}
          {showProjectsList && (
            <ProjectList selectedTechnology={selectedTech} />
          )}
        </div>
      )}
    </div>
  );
}
