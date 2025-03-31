import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Quadrant, Ring } from "@shared/schema";

export default function RadarOverview() {
  const { data: quadrants, isLoading: quadrantsLoading } = useQuery({ 
    queryKey: ['/api/quadrants'], 
  });

  const { data: rings, isLoading: ringsLoading } = useQuery({ 
    queryKey: ['/api/rings'],
  });

  const { data: technologies, isLoading: technologiesLoading } = useQuery({ 
    queryKey: ['/api/technologies'],
  });

  const isLoading = quadrantsLoading || ringsLoading || technologiesLoading;

  const getQuadrantIcon = (index: number) => {
    const icons = [
      // Techniques icon
      <svg key="techniques" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>,
      // Tools icon
      <svg key="tools" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>,
      // Platforms icon
      <svg key="platforms" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>,
      // Languages & Frameworks icon
      <svg key="languages" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ];
    
    return icons[index] || icons[0];
  };

  const getQuadrantColorClass = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-indigo-100 text-indigo-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600'
    ];
    return colors[index] || colors[0];
  };

  const getRingColorClass = (index: number) => {
    const colors = [
      'bg-radar-adopt', // Adopt - green
      'bg-radar-trial', // Trial - blue
      'bg-radar-assess', // Assess - amber
      'bg-radar-hold'   // Hold - red
    ];
    return colors[index] || colors[0];
  };

  // Count technologies by quadrant
  const countTechsByQuadrant = (quadrantId: number) => {
    if (!technologies) return 0;
    return technologies.filter(tech => tech.quadrant === quadrantId).length;
  };

  return (
    <div className="mb-8 container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Technology Radar</h2>
        <p className="text-slate-600">An opinionated guide to technology frontiers for developers and technology leaders.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {quadrants?.map((quadrant: Quadrant, index: number) => (
              <div key={quadrant.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
                <div className="flex items-center mb-3">
                  <div className={`h-10 w-10 flex items-center justify-center rounded-full ${getQuadrantColorClass(index)} mr-3`}>
                    {getQuadrantIcon(index)}
                  </div>
                  <h3 className="text-lg font-semibold">{quadrant.name}</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">{quadrant.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{countTechsByQuadrant(index)} technologies</span>
                  <Link href="/technologies">
                    <a className="text-blue-600 font-medium hover:text-blue-800">View all</a>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mb-8">
            <div className="md:w-1/2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Radar Quadrants</h3>
              <p className="text-slate-600 mb-4">The Tech Radar is split into four quadrants representing different kinds of technologies.</p>
              
              <ul className="space-y-3">
                {quadrants?.map((quadrant: Quadrant, index: number) => (
                  <li key={quadrant.id} className="flex items-start">
                    <span className={`flex-shrink-0 h-5 w-5 rounded-full ${getQuadrantColorClass(index)} flex items-center justify-center mt-0.5 mr-3`}>
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">{quadrant.name}</span>
                      <p className="text-slate-500 text-sm">{quadrant.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Radar Rings</h3>
              <p className="text-slate-600 mb-4">The rings indicate what stage in the lifecycle we think a technology is at.</p>
              
              <ul className="space-y-3">
                {rings?.map((ring: Ring, index: number) => (
                  <li key={ring.id} className="flex items-start">
                    <span className={`flex-shrink-0 h-5 w-5 rounded-full ${getRingColorClass(index)} flex items-center justify-center mt-0.5 mr-3`}>
                      <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">{ring.name}</span>
                      <p className="text-slate-500 text-sm">{ring.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
