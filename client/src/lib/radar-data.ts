import { Technology, Quadrant, Ring } from "@shared/schema";

// Type for the radar visualization data
export interface RadarVisualizationData {
  technologies: Technology[];
  quadrants: Quadrant[];
  rings: Ring[];
}

// Colors for the rings (matching design reference)
export const RING_COLORS = [
  'hsl(151, 76%, 40%)', // Adopt - green (#10b981)
  'hsl(217, 91%, 60%)', // Trial - blue (#3b82f6)
  'hsl(38, 92%, 50%)',  // Assess - amber (#f59e0b)
  'hsl(0, 84%, 60%)'    // Hold - red (#ef4444)
];

// Ring fill opacities
export const RING_OPACITIES = [0.15, 0.1, 0.1, 0.1];

// Function to get the ring's color
export const getRingColor = (ringId: number): string => {
  return RING_COLORS[ringId] || RING_COLORS[0];
};

// Function to get a quadrant's angle in radians (starting positions)
export const getQuadrantAngle = (quadrantId: number): number => {
  const angles = [
    0,            // Techniques - top right
    Math.PI / 2,  // Tools - bottom right
    Math.PI,      // Platforms - bottom left
    3 * Math.PI / 2 // Languages & Frameworks - top left
  ];
  return angles[quadrantId] || 0;
};

// Get background color class for quadrant badges
export const getQuadrantBgClass = (quadrantId: number): string => {
  const classes = [
    'bg-blue-100 text-blue-800',     // Techniques
    'bg-indigo-100 text-indigo-800', // Tools
    'bg-purple-100 text-purple-800', // Platforms
    'bg-pink-100 text-pink-800'      // Languages & Frameworks
  ];
  return classes[quadrantId] || classes[0];
};

// Get background color class for ring badges
export const getRingBgClass = (ringId: number): string => {
  const classes = [
    'bg-green-100 text-green-800',  // Adopt
    'bg-blue-100 text-blue-800',    // Trial
    'bg-yellow-100 text-yellow-800', // Assess
    'bg-red-100 text-red-800'       // Hold
  ];
  return classes[ringId] || classes[0];
};

// Generate random positions for technologies within their quadrant and ring
export const generateTechPositions = (
  technology: Technology,
  quadrantAngles: number[],
  ringRadii: number[]
): { x: number; y: number } => {
  const angle = quadrantAngles[technology.quadrant];
  const radius = ringRadii[technology.ring];
  
  // Add random offsets to avoid overlapping
  const angleOffset = (Math.random() - 0.5) * Math.PI / 3;
  const radiusOffset = 0.7 + Math.random() * 0.3;
  
  const finalAngle = angle + angleOffset;
  const finalRadius = radius * radiusOffset;
  
  return {
    x: Math.cos(finalAngle) * finalRadius,
    y: Math.sin(finalAngle) * finalRadius
  };
};
