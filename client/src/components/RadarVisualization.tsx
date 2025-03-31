import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { Technology, Quadrant, Ring } from "@shared/schema";
import { 
  RING_COLORS, 
  RING_OPACITIES, 
  getRingColor, 
  getQuadrantAngle, 
  getRingBgClass 
} from "@/lib/radar-data";

export default function RadarVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);

  const { data: technologies, isLoading: techsLoading } = useQuery({ 
    queryKey: ['/api/technologies'],
  });

  const { data: quadrants, isLoading: quadrantsLoading } = useQuery({ 
    queryKey: ['/api/quadrants'],
  });

  const { data: rings, isLoading: ringsLoading } = useQuery({ 
    queryKey: ['/api/rings'],
  });

  const isLoading = techsLoading || quadrantsLoading || ringsLoading;

  useEffect(() => {
    if (isLoading || !technologies || !quadrants || !rings || !svgRef.current || !containerRef.current) {
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
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", ringRadii[i])
        .attr("fill", RING_COLORS[i])
        .attr("fill-opacity", RING_OPACITIES[i])
        .attr("stroke", RING_COLORS[i])
        .attr("stroke-width", 1);
      
      // Ring labels
      g.append("text")
        .attr("x", 5)
        .attr("y", -ringRadii[i] + 15)
        .attr("text-anchor", "start")
        .attr("fill", "#64748b")
        .attr("font-size", "10px")
        .text(ring.name);
    });

    // Define quadrant angles
    const quadrantAngles = quadrants.map((_: Quadrant, i: number) => getQuadrantAngle(i));

    // Draw quadrant lines
    quadrantAngles.forEach((angle: number, i: number) => {
      const x2 = Math.cos(angle) * radius;
      const y2 = Math.sin(angle) * radius;
      
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#64748b")
        .attr("stroke-width", 1);
      
      // Quadrant labels
      const labelRadius = radius + 15;
      const labelX = Math.cos(angle + Math.PI / 4) * labelRadius;
      const labelY = Math.sin(angle + Math.PI / 4) * labelRadius;
      
      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", angle < Math.PI ? "start" : "end")
        .attr("alignment-baseline", angle < Math.PI / 2 || angle > 3 * Math.PI / 2 ? "hanging" : "baseline")
        .attr("fill", "#1e293b")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text(quadrants[i].name);
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
      
      // Technology dot
      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5)
        .attr("fill", RING_COLORS[tech.ring])
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).attr("r", 7);
        })
        .on("mouseout", function() {
          d3.select(this).attr("r", 5);
        })
        .on("click", function() {
          setSelectedTech(tech);
        });
      
      // Technology label
      g.append("text")
        .attr("x", x + 8)
        .attr("y", y + 3)
        .attr("text-anchor", "start")
        .attr("fill", "#1e293b")
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .text(tech.name);
    });

  }, [isLoading, technologies, quadrants, rings, selectedQuadrant]);

  const handleQuadrantFilter = (quadrantId: number | null) => {
    setSelectedQuadrant(quadrantId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8 container mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-bold mb-2 lg:mb-0">Technology Radar Visualization</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`${selectedQuadrant === null ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-800'} px-3 py-1.5 rounded-full text-sm font-medium`}
            onClick={() => handleQuadrantFilter(null)}
          >
            All Quadrants
          </button>
          {quadrants?.map((quadrant: Quadrant, index: number) => (
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 mb-6 lg:mb-0">
            <div ref={containerRef} className="w-full h-[500px] flex items-center justify-center">
              <svg ref={svgRef}></svg>
            </div>
          </div>
          <div className="w-full lg:w-1/3 lg:pl-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Selected Technology</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {selectedTech ? (
                  <div>
                    <div className="mb-2">
                      <h4 className="font-semibold text-lg">{selectedTech.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRingBgClass(selectedTech.ring)}`}>
                          {rings && rings[selectedTech.ring]?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {quadrants && quadrants[selectedTech.quadrant]?.name}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{selectedTech.description}</p>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <a href={`/technologies?tech=${selectedTech.id}`} className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        View full details →
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Click on a technology in the radar to see details</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Legend</h3>
              <div className="space-y-2">
                {rings?.map((ring: Ring, index: number) => (
                  <div key={ring.id} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: RING_COLORS[index] }}
                    ></div>
                    <span className="text-sm">{ring.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
