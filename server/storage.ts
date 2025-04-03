import { 
  technologies, 
  type Technology, 
  type InsertTechnology,
  quadrants, 
  type Quadrant, 
  type InsertQuadrant,
  rings, 
  type Ring, 
  type InsertRing,
  projects,
  type Project,
  type InsertProject,
  technologyProjects,
  type TechnologyProject,
  type InsertTechnologyProject
} from "@shared/schema";

export interface IStorage {
  // Technology operations
  getTechnology(id: number): Promise<Technology | undefined>;
  getTechnologies(): Promise<Technology[]>;
  searchTechnologies(query: string): Promise<Technology[]>;
  createTechnology(technology: InsertTechnology): Promise<Technology>;
  updateTechnology(id: number, technology: Partial<InsertTechnology>): Promise<Technology | undefined>;
  
  // Quadrant operations
  getQuadrant(id: number): Promise<Quadrant | undefined>;
  getQuadrants(): Promise<Quadrant[]>;
  createQuadrant(quadrant: InsertQuadrant): Promise<Quadrant>;
  updateQuadrant(id: number, quadrant: Partial<InsertQuadrant>): Promise<Quadrant | undefined>;

  // Ring operations
  getRing(id: number): Promise<Ring | undefined>;
  getRings(): Promise<Ring[]>;
  createRing(ring: InsertRing): Promise<Ring>;
  updateRing(id: number, ring: Partial<InsertRing>): Promise<Ring | undefined>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByTechnology(technologyId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;

  // Technology-Project relationship operations
  linkTechnologyToProject(techProjectLink: InsertTechnologyProject): Promise<TechnologyProject>;
  getTechnologiesForProject(projectId: number): Promise<Technology[]>;
  getProjectsForTechnology(technologyId: number): Promise<Project[]>;
}

export class MemStorage implements IStorage {
  private technologies: Map<number, Technology>;
  private quadrants: Map<number, Quadrant>;
  private rings: Map<number, Ring>;
  private projects: Map<number, Project>;
  private technologyProjects: Map<number, TechnologyProject>;
  
  private techCurrentId: number;
  private quadrantCurrentId: number;
  private ringCurrentId: number;
  private projectCurrentId: number;
  private techProjectCurrentId: number;

  constructor() {
    this.technologies = new Map();
    this.quadrants = new Map();
    this.rings = new Map();
    this.projects = new Map();
    this.technologyProjects = new Map();
    
    this.techCurrentId = 1;
    this.quadrantCurrentId = 1;
    this.ringCurrentId = 1;
    this.projectCurrentId = 1;
    this.techProjectCurrentId = 1;

    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Clear all existing data
    this.technologies.clear();
    this.quadrants.clear();
    this.rings.clear();
    this.projects.clear();
    this.technologyProjects.clear();
    
    // Reset all IDs
    this.techCurrentId = 1;
    this.quadrantCurrentId = 1;
    this.ringCurrentId = 1;
    this.projectCurrentId = 1;
    this.techProjectCurrentId = 1;
    
    // Create quadrants from the image data
    const techniques = this.createQuadrant({ 
      name: "Techniques", 
      description: "Elements of a software development process, such as experience design and coding practices", 
      color: "#3b82f6" 
    });
    
    const tools = this.createQuadrant({ 
      name: "Tools", 
      description: "Software development tools and supporting services", 
      color: "#8b5cf6" 
    });
    
    const frameworks = this.createQuadrant({ 
      name: "Frameworks", 
      description: "Programming frameworks and foundation libraries", 
      color: "#f97316" 
    });
    
    const platforms = this.createQuadrant({ 
      name: "Platforms", 
      description: "Things that we build software on top of: infrastructure, databases, etc.", 
      color: "#ec4899" 
    });

    // Create rings from the image data
    const adopt = this.createRing({ 
      name: "Adopt", 
      description: "We strongly recommend using these technologies when appropriate", 
      color: "#10b981" 
    });
    
    const trial = this.createRing({ 
      name: "Trial", 
      description: "These technologies are ready for trial use, but not yet for widespread adoption", 
      color: "#3b82f6" 
    });
    
    const assess = this.createRing({ 
      name: "Assess", 
      description: "These technologies are worth exploring to understand how they can be useful", 
      color: "#f59e0b" 
    });
    
    const hold = this.createRing({ 
      name: "Hold", 
      description: "Proceed with caution with these technologies", 
      color: "#ef4444" 
    });

    // Tools - Adopt
    this.createTechnology({ name: "Claude Sonnet", description: "AI assistant model from Anthropic", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "Tuple", description: "Remote pair programming tool", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "YOLO", description: "Real-time object detection system", quadrant: 1, ring: 0 });
    
    // Tools - Trial
    this.createTechnology({ name: "D2", description: "Declarative diagramming language", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "metabase", description: "Business intelligence and analytics tool", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "Anything LLM", description: "Open-source ChatGPT alternative", quadrant: 1, ring: 1 });
    
    // Techniques - Adopt
    this.createTechnology({ name: "GraphRAG", description: "Graph-based Retrieval Augmented Generation", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Small language models", description: "Smaller, efficient AI language models", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Model Distillation", description: "Technique to create smaller models from larger ones", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Prompt Engineering", description: "Designing effective prompts for AI models", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Mixed reality", description: "Blend of physical and digital worlds", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Ambient Computing", description: "Technology integrated into environment", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Explainable AI", description: "AI systems with understandable decisions", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Multimodal AI", description: "AI that handles multiple input/output types", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Shadow AI mastering", description: "AI mastering process", quadrant: 0, ring: 0 });
    
    // Techniques - Trial
    this.createTechnology({ name: "Quantum computing", description: "Computing based on quantum mechanics", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Quantum Sensing", description: "Detecting signals using quantum properties", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Edge Computing", description: "Processing data near the source", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Adaptive AI", description: "AI that adapts to changing conditions", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Advanced Swarm Systems", description: "Decentralized, self-organized systems", quadrant: 0, ring: 1 });
    
    // Techniques - Assess
    this.createTechnology({ name: "Wearable Technologies", description: "Computing devices worn on body", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "HMO", description: "Health maintenance organization", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "Digital Identity", description: "Electronic verification of identity", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "5G/6G", description: "Mobile network technologies", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "3D Data visualization", description: "Visual representation of data in 3D", quadrant: 0, ring: 2 });
    
    // Frameworks - Adopt
    this.createTechnology({ name: "Crew AI", description: "AI framework for team collaboration", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langraph", description: "Graph-based framework for language models", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Agony", description: "Framework for efficient data processing", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langchain", description: "Framework for developing applications powered by language models", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langsmith", description: "Developer platform for LLM applications", quadrant: 2, ring: 0 });
    
    // Platforms - Adopt
    this.createTechnology({ name: "Trino", description: "Distributed SQL query engine", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Gitlab CI/CD", description: "Continuous integration and delivery platform", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Deepseek R1", description: "AI platform for research", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Chain loop", description: "Software supply chain management platform", quadrant: 3, ring: 0 });
    
    // Platforms - Trial
    this.createTechnology({ name: "Railway", description: "Application deployment platform", quadrant: 3, ring: 1 });
    
    // Sample project
    const techRadar = this.createProject({
      name: "VW Tech Radar",
      description: "Visualization tool for technology choices and assessment",
      status: "active"
    });
  }

  async getTechnology(id: number): Promise<Technology | undefined> {
    return this.technologies.get(id);
  }

  async getTechnologies(): Promise<Technology[]> {
    return Array.from(this.technologies.values());
  }

  async searchTechnologies(query: string): Promise<Technology[]> {
    if (!query || query.trim() === "") {
      return this.getTechnologies();
    }
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.technologies.values()).filter(tech => {
      // Search in name, description, and tags
      const nameMatch = tech.name.toLowerCase().includes(lowerQuery);
      const descMatch = tech.description.toLowerCase().includes(lowerQuery);
      const tagsMatch = tech.tags ? tech.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) : false;
      
      return nameMatch || descMatch || tagsMatch;
    });
  }

  async createTechnology(insertTechnology: InsertTechnology): Promise<Technology> {
    const id = this.techCurrentId++;
    // Initialize default values for optional fields
    const technology: Technology = { 
      ...insertTechnology, 
      id,
      website: insertTechnology.website || null,
      tags: insertTechnology.tags || [],
      custom_properties: insertTechnology.custom_properties || null
    };
    this.technologies.set(id, technology);
    return technology;
  }

  async updateTechnology(id: number, technologyUpdate: Partial<InsertTechnology>): Promise<Technology | undefined> {
    const existingTech = this.technologies.get(id);
    if (!existingTech) {
      return undefined;
    }
    
    const updatedTech: Technology = { ...existingTech, ...technologyUpdate };
    this.technologies.set(id, updatedTech);
    return updatedTech;
  }

  // Quadrant methods
  async getQuadrant(id: number): Promise<Quadrant | undefined> {
    return this.quadrants.get(id);
  }

  async getQuadrants(): Promise<Quadrant[]> {
    return Array.from(this.quadrants.values());
  }

  async createQuadrant(insertQuadrant: InsertQuadrant): Promise<Quadrant> {
    const id = this.quadrantCurrentId++;
    const quadrant: Quadrant = { 
      ...insertQuadrant, 
      id,
      color: insertQuadrant.color || null
    };
    this.quadrants.set(id, quadrant);
    return quadrant;
  }

  async updateQuadrant(id: number, quadrantUpdate: Partial<InsertQuadrant>): Promise<Quadrant | undefined> {
    const existingQuadrant = this.quadrants.get(id);
    if (!existingQuadrant) {
      return undefined;
    }
    
    const updatedQuadrant: Quadrant = { ...existingQuadrant, ...quadrantUpdate };
    this.quadrants.set(id, updatedQuadrant);
    return updatedQuadrant;
  }

  // Ring methods
  async getRing(id: number): Promise<Ring | undefined> {
    return this.rings.get(id);
  }

  async getRings(): Promise<Ring[]> {
    return Array.from(this.rings.values());
  }

  async createRing(insertRing: InsertRing): Promise<Ring> {
    const id = this.ringCurrentId++;
    const ring: Ring = { 
      ...insertRing, 
      id,
      color: insertRing.color || null
    };
    this.rings.set(id, ring);
    return ring;
  }

  async updateRing(id: number, ringUpdate: Partial<InsertRing>): Promise<Ring | undefined> {
    const existingRing = this.rings.get(id);
    if (!existingRing) {
      return undefined;
    }
    
    const updatedRing: Ring = { ...existingRing, ...ringUpdate };
    this.rings.set(id, updatedRing);
    return updatedRing;
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByTechnology(technologyId: number): Promise<Project[]> {
    const projectIds = new Set<number>();
    
    // Find all technology-project relationships for this technology
    Array.from(this.technologyProjects.values()).forEach(tp => {
      if (tp.technology_id === technologyId) {
        projectIds.add(tp.project_id);
      }
    });
    
    // Get all projects with matching IDs
    return Array.from(this.projects.values()).filter(project => 
      projectIds.has(project.id)
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const project: Project = { 
      ...insertProject, 
      id,
      website: insertProject.website || null,
      image: insertProject.image || null,
      repository: insertProject.repository || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      return undefined;
    }
    
    const updatedProject: Project = { ...existingProject, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Technology-Project relationship methods
  async linkTechnologyToProject(techProjectLink: InsertTechnologyProject): Promise<TechnologyProject> {
    const id = this.techProjectCurrentId++;
    const link: TechnologyProject = { 
      ...techProjectLink, 
      id,
      notes: techProjectLink.notes || null 
    };
    this.technologyProjects.set(id, link);
    return link;
  }

  async getTechnologiesForProject(projectId: number): Promise<Technology[]> {
    const technologyIds = new Set<number>();
    
    // Find all technology-project relationships for this project
    Array.from(this.technologyProjects.values()).forEach(tp => {
      if (tp.project_id === projectId) {
        technologyIds.add(tp.technology_id);
      }
    });
    
    // Get all technologies with matching IDs
    return Array.from(this.technologies.values()).filter(tech => 
      technologyIds.has(tech.id)
    );
  }

  async getProjectsForTechnology(technologyId: number): Promise<Project[]> {
    const projectIds = new Set<number>();
    
    // Find all technology-project relationships for this technology
    Array.from(this.technologyProjects.values()).forEach(tp => {
      if (tp.technology_id === technologyId) {
        projectIds.add(tp.project_id);
      }
    });
    
    // Get all projects with matching IDs
    return Array.from(this.projects.values()).filter(project => 
      projectIds.has(project.id)
    );
  }
}

export const storage = new MemStorage();
