import { technologies, type Technology, type InsertTechnology } from "@shared/schema";
import { quadrants, type Quadrant, type InsertQuadrant } from "@shared/schema";
import { rings, type Ring, type InsertRing } from "@shared/schema";

export interface IStorage {
  // Technology operations
  getTechnology(id: number): Promise<Technology | undefined>;
  getTechnologies(): Promise<Technology[]>;
  createTechnology(technology: InsertTechnology): Promise<Technology>;
  
  // Quadrant operations
  getQuadrant(id: number): Promise<Quadrant | undefined>;
  getQuadrants(): Promise<Quadrant[]>;
  createQuadrant(quadrant: InsertQuadrant): Promise<Quadrant>;

  // Ring operations
  getRing(id: number): Promise<Ring | undefined>;
  getRings(): Promise<Ring[]>;
  createRing(ring: InsertRing): Promise<Ring>;
}

export class MemStorage implements IStorage {
  private technologies: Map<number, Technology>;
  private quadrants: Map<number, Quadrant>;
  private rings: Map<number, Ring>;
  private techCurrentId: number;
  private quadrantCurrentId: number;
  private ringCurrentId: number;

  constructor() {
    this.technologies = new Map();
    this.quadrants = new Map();
    this.rings = new Map();
    this.techCurrentId = 1;
    this.quadrantCurrentId = 1;
    this.ringCurrentId = 1;

    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Default quadrants
    const defaultQuadrants: InsertQuadrant[] = [
      { name: "Techniques", description: "Elements of a software development process, such as CI/CD, DevOps, testing approaches, or other ways of working." },
      { name: "Tools", description: "Software tools that support development and operations of solutions, including IDE/editors, monitoring, and CI/CD tools." },
      { name: "Platforms", description: "Products that serve as a foundation for building solutions, including cloud providers, databases, and operating systems." },
      { name: "Languages & Frameworks", description: "Programming languages and frameworks used to build and extend applications and services." }
    ];

    // Default rings
    const defaultRings: InsertRing[] = [
      { name: "Adopt", description: "We strongly recommend this technology. We have used it successfully in multiple projects and are confident in our understanding of how to apply it." },
      { name: "Trial", description: "Worth pursuing. We have used it with positive results but still have reservations or limited experience. Expect some investment to get the most out of it." },
      { name: "Assess", description: "Worth exploring with the goal of understanding how it might affect our projects. Promising technology but not fully proven in our context." },
      { name: "Hold", description: "Proceed with caution. Either an unproven technology or one that is no longer recommended for new projects." }
    ];

    // Default technologies
    const defaultTechnologies: InsertTechnology[] = [
      { name: "React", quadrant: 3, ring: 0, description: "A JavaScript library for building user interfaces with a component-based approach." },
      { name: "Kubernetes", quadrant: 2, ring: 0, description: "An open-source container orchestration platform for automating deployment, scaling, and management." },
      { name: "TypeScript", quadrant: 3, ring: 0, description: "A superset of JavaScript that adds static typing and other features to enhance development." },
      { name: "GitOps", quadrant: 0, ring: 1, description: "An operational framework that takes DevOps best practices and applies them to infrastructure automation." },
      { name: "AWS Lambda", quadrant: 2, ring: 0, description: "An event-driven, serverless computing platform provided by Amazon Web Services." },
      { name: "Web Assembly", quadrant: 3, ring: 2, description: "A binary instruction format for a stack-based virtual machine, designed to be a portable compilation target." },
      { name: "Jenkins", quadrant: 1, ring: 3, description: "An open-source automation server that enables developers to build, test, and deploy their software." },
      { name: "Docker", quadrant: 1, ring: 0, description: "A platform for developing, shipping, and running applications in containers." },
      { name: "GraphQL", quadrant: 3, ring: 1, description: "A query language for APIs and a runtime for executing those queries with your existing data." },
      { name: "Terraform", quadrant: 1, ring: 0, description: "An open-source infrastructure as code software tool for building, changing, and versioning infrastructure safely and efficiently." },
      { name: "Rust", quadrant: 3, ring: 2, description: "A multi-paradigm programming language designed for performance and safety, especially safe concurrency." },
      { name: "Next.js", quadrant: 3, ring: 1, description: "A React framework that gives you building blocks to create web applications." },
      { name: "TailwindCSS", quadrant: 3, ring: 1, description: "A utility-first CSS framework for rapidly building custom user interfaces." }
    ];

    // Add default quadrants
    defaultQuadrants.forEach(quadrant => {
      this.createQuadrant(quadrant);
    });

    // Add default rings
    defaultRings.forEach(ring => {
      this.createRing(ring);
    });

    // Add default technologies
    defaultTechnologies.forEach(tech => {
      this.createTechnology(tech);
    });
  }

  // Technology methods
  async getTechnology(id: number): Promise<Technology | undefined> {
    return this.technologies.get(id);
  }

  async getTechnologies(): Promise<Technology[]> {
    return Array.from(this.technologies.values());
  }

  async createTechnology(insertTechnology: InsertTechnology): Promise<Technology> {
    const id = this.techCurrentId++;
    const technology: Technology = { ...insertTechnology, id };
    this.technologies.set(id, technology);
    return technology;
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
    const quadrant: Quadrant = { ...insertQuadrant, id };
    this.quadrants.set(id, quadrant);
    return quadrant;
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
    const ring: Ring = { ...insertRing, id };
    this.rings.set(id, ring);
    return ring;
  }
}

export const storage = new MemStorage();
