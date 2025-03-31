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
    // Default quadrants with custom colors
    const defaultQuadrants: InsertQuadrant[] = [
      { name: "Techniques", description: "Elements of a software development process, such as CI/CD, DevOps, testing approaches, or other ways of working.", color: "#3b82f6" },
      { name: "Tools", description: "Software tools that support development and operations of solutions, including IDE/editors, monitoring, and CI/CD tools.", color: "#8b5cf6" },
      { name: "Platforms", description: "Products that serve as a foundation for building solutions, including cloud providers, databases, and operating systems.", color: "#ec4899" },
      { name: "Languages & Frameworks", description: "Programming languages and frameworks used to build and extend applications and services.", color: "#f97316" }
    ];

    // Default rings with custom colors
    const defaultRings: InsertRing[] = [
      { name: "Adopt", description: "We strongly recommend this technology. We have used it successfully in multiple projects and are confident in our understanding of how to apply it.", color: "#10b981" },
      { name: "Trial", description: "Worth pursuing. We have used it with positive results but still have reservations or limited experience. Expect some investment to get the most out of it.", color: "#3b82f6" },
      { name: "Assess", description: "Worth exploring with the goal of understanding how it might affect our projects. Promising technology but not fully proven in our context.", color: "#f59e0b" },
      { name: "Hold", description: "Proceed with caution. Either an unproven technology or one that is no longer recommended for new projects.", color: "#ef4444" }
    ];

    // Extended set of technologies with tags and websites
    const defaultTechnologies: InsertTechnology[] = [
      { 
        name: "React", 
        quadrant: 3, 
        ring: 0, 
        description: "A JavaScript library for building user interfaces with a component-based approach.",
        website: "https://react.dev",
        tags: ["frontend", "javascript", "ui"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "Angular", 
        quadrant: 3, 
        ring: 1, 
        description: "A platform and framework for building single-page client applications using HTML and TypeScript.",
        website: "https://angular.io",
        tags: ["frontend", "typescript", "framework"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "steep" })
      },
      { 
        name: "Vue.js", 
        quadrant: 3, 
        ring: 1, 
        description: "A progressive JavaScript framework for building user interfaces.",
        website: "https://vuejs.org",
        tags: ["frontend", "javascript", "framework"],
        custom_properties: JSON.stringify({ ecosystem_size: "medium", learning_curve: "gentle" })
      },
      { 
        name: "Kubernetes", 
        quadrant: 2, 
        ring: 0, 
        description: "An open-source container orchestration platform for automating deployment, scaling, and management.",
        website: "https://kubernetes.io",
        tags: ["container", "orchestration", "devops"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "steep" })
      },
      { 
        name: "Docker", 
        quadrant: 1, 
        ring: 0, 
        description: "A platform for developing, shipping, and running applications in containers.",
        website: "https://www.docker.com",
        tags: ["container", "devops", "deployment"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "TypeScript", 
        quadrant: 3, 
        ring: 0, 
        description: "A superset of JavaScript that adds static typing and other features to enhance development.",
        website: "https://www.typescriptlang.org",
        tags: ["language", "javascript", "static typing"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "GitOps", 
        quadrant: 0, 
        ring: 1, 
        description: "An operational framework that takes DevOps best practices and applies them to infrastructure automation.",
        website: "https://www.gitops.tech",
        tags: ["devops", "methodology", "infrastructure"],
        custom_properties: JSON.stringify({ ecosystem_size: "growing", learning_curve: "medium" })
      },
      { 
        name: "AWS Lambda", 
        quadrant: 2, 
        ring: 0, 
        description: "An event-driven, serverless computing platform provided by Amazon Web Services.",
        website: "https://aws.amazon.com/lambda",
        tags: ["serverless", "cloud", "aws"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "Azure Functions", 
        quadrant: 2, 
        ring: 1, 
        description: "Microsoft's serverless solution that enables you to write less code, maintain less infrastructure.",
        website: "https://azure.microsoft.com/en-us/products/functions",
        tags: ["serverless", "cloud", "azure"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "Web Assembly", 
        quadrant: 3, 
        ring: 2, 
        description: "A binary instruction format for a stack-based virtual machine, designed to be a portable compilation target.",
        website: "https://webassembly.org",
        tags: ["browser", "performance", "compilation"],
        custom_properties: JSON.stringify({ ecosystem_size: "growing", learning_curve: "steep" })
      },
      { 
        name: "Jenkins", 
        quadrant: 1, 
        ring: 3, 
        description: "An open-source automation server that enables developers to build, test, and deploy their software.",
        website: "https://www.jenkins.io",
        tags: ["ci/cd", "automation", "devops"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "GitHub Actions", 
        quadrant: 1, 
        ring: 0, 
        description: "GitHub's built-in continuous integration and continuous delivery (CI/CD) platform.",
        website: "https://github.com/features/actions",
        tags: ["ci/cd", "automation", "github"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      },
      { 
        name: "GitLab CI", 
        quadrant: 1, 
        ring: 1, 
        description: "GitLab's built-in continuous integration service to build, test, and deploy your code.",
        website: "https://docs.gitlab.com/ee/ci",
        tags: ["ci/cd", "automation", "gitlab"],
        custom_properties: JSON.stringify({ ecosystem_size: "medium", learning_curve: "medium" })
      },
      { 
        name: "GraphQL", 
        quadrant: 3, 
        ring: 1, 
        description: "A query language for APIs and a runtime for executing those queries with your existing data.",
        website: "https://graphql.org",
        tags: ["api", "query language", "data fetching"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "REST API", 
        quadrant: 3, 
        ring: 0, 
        description: "An architectural style for distributed hypermedia systems, commonly used for web services.",
        website: null,
        tags: ["api", "web services", "architecture"],
        custom_properties: JSON.stringify({ ecosystem_size: "ubiquitous", learning_curve: "gentle" })
      },
      { 
        name: "Terraform", 
        quadrant: 1, 
        ring: 0, 
        description: "An open-source infrastructure as code software tool for building, changing, and versioning infrastructure safely and efficiently.",
        website: "https://www.terraform.io",
        tags: ["infrastructure as code", "devops", "automation"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "AWS CloudFormation", 
        quadrant: 1, 
        ring: 1, 
        description: "A service that helps you model and set up your AWS resources so you can spend less time managing those resources and more time focusing on your applications.",
        website: "https://aws.amazon.com/cloudformation",
        tags: ["infrastructure as code", "aws", "cloud"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "steep" })
      },
      { 
        name: "Rust", 
        quadrant: 3, 
        ring: 2, 
        description: "A multi-paradigm programming language designed for performance and safety, especially safe concurrency.",
        website: "https://www.rust-lang.org",
        tags: ["language", "systems programming", "performance"],
        custom_properties: JSON.stringify({ ecosystem_size: "growing", learning_curve: "steep" })
      },
      { 
        name: "Go", 
        quadrant: 3, 
        ring: 0, 
        description: "A statically typed, compiled programming language designed at Google with simplicity and performance in mind.",
        website: "https://golang.org",
        tags: ["language", "backend", "performance"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "Kotlin", 
        quadrant: 3, 
        ring: 1, 
        description: "A cross-platform, statically typed, general-purpose programming language with type inference.",
        website: "https://kotlinlang.org",
        tags: ["language", "jvm", "android"],
        custom_properties: JSON.stringify({ ecosystem_size: "medium", learning_curve: "gentle" })
      },
      { 
        name: "Next.js", 
        quadrant: 3, 
        ring: 0, 
        description: "A React framework that gives you building blocks to create web applications.",
        website: "https://nextjs.org",
        tags: ["framework", "react", "frontend"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "NestJS", 
        quadrant: 3, 
        ring: 1, 
        description: "A progressive Node.js framework for building efficient, reliable and scalable server-side applications.",
        website: "https://nestjs.com",
        tags: ["framework", "nodejs", "backend"],
        custom_properties: JSON.stringify({ ecosystem_size: "growing", learning_curve: "medium" })
      },
      { 
        name: "TailwindCSS", 
        quadrant: 3, 
        ring: 0, 
        description: "A utility-first CSS framework for rapidly building custom user interfaces.",
        website: "https://tailwindcss.com",
        tags: ["css", "frontend", "styling"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      },
      { 
        name: "PostgreSQL", 
        quadrant: 2, 
        ring: 0, 
        description: "A powerful, open source object-relational database system with over 30 years of active development.",
        website: "https://www.postgresql.org",
        tags: ["database", "sql", "relational"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "MongoDB", 
        quadrant: 2, 
        ring: 1, 
        description: "A general purpose, document-based, distributed database built for modern application developers.",
        website: "https://www.mongodb.com",
        tags: ["database", "nosql", "document"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      },
      { 
        name: "Redis", 
        quadrant: 2, 
        ring: 0, 
        description: "An open source, in-memory data structure store, used as a database, cache, and message broker.",
        website: "https://redis.io",
        tags: ["database", "cache", "in-memory"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      },
      { 
        name: "Drizzle ORM", 
        quadrant: 3, 
        ring: 2, 
        description: "A lightweight TypeScript ORM with a focus on type safety and developer experience.",
        website: "https://github.com/drizzle-team/drizzle-orm",
        tags: ["orm", "database", "typescript"],
        custom_properties: JSON.stringify({ ecosystem_size: "growing", learning_curve: "gentle" })
      },
      { 
        name: "Prisma", 
        quadrant: 3, 
        ring: 1, 
        description: "Next-generation ORM for Node.js and TypeScript.",
        website: "https://www.prisma.io",
        tags: ["orm", "database", "typescript"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      },
      { 
        name: "Python", 
        quadrant: 3, 
        ring: 0, 
        description: "A high-level, general-purpose programming language known for its readability and versatility.",
        website: "https://www.python.org",
        tags: ["language", "backend", "data science", "machine learning"],
        custom_properties: JSON.stringify({ ecosystem_size: "massive", learning_curve: "gentle" })
      },
      { 
        name: "Java", 
        quadrant: 3, 
        ring: 0, 
        description: "A class-based, object-oriented programming language designed for portability and cross-platform development.",
        website: "https://www.java.com",
        tags: ["language", "backend", "enterprise"],
        custom_properties: JSON.stringify({ ecosystem_size: "massive", learning_curve: "medium" })
      },
      { 
        name: "Django", 
        quadrant: 3, 
        ring: 1, 
        description: "A high-level Python web framework that encourages rapid development and clean, pragmatic design.",
        website: "https://www.djangoproject.com",
        tags: ["framework", "python", "backend", "web"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "Flask", 
        quadrant: 3, 
        ring: 1, 
        description: "A lightweight WSGI web application framework in Python, designed to make getting started quick and easy.",
        website: "https://flask.palletsprojects.com",
        tags: ["framework", "python", "backend", "web", "microservices"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      },
      { 
        name: "Spring Boot", 
        quadrant: 3, 
        ring: 0, 
        description: "An open-source Java-based framework used to create stand-alone, production-grade Spring-based applications.",
        website: "https://spring.io/projects/spring-boot",
        tags: ["framework", "java", "backend", "enterprise"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "steep" })
      },
      { 
        name: "TensorFlow", 
        quadrant: 3, 
        ring: 1, 
        description: "An end-to-end open-source platform for machine learning, with a comprehensive ecosystem of tools.",
        website: "https://www.tensorflow.org",
        tags: ["machine learning", "python", "data science", "library"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "steep" })
      },
      { 
        name: "PyTorch", 
        quadrant: 3, 
        ring: 1, 
        description: "An open-source machine learning library based on Torch, used for applications such as computer vision and natural language processing.",
        website: "https://pytorch.org",
        tags: ["machine learning", "python", "data science", "library"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "medium" })
      },
      { 
        name: "Docker Compose", 
        quadrant: 1, 
        ring: 0, 
        description: "A tool for defining and running multi-container Docker applications.",
        website: "https://docs.docker.com/compose",
        tags: ["container", "docker", "configuration"],
        custom_properties: JSON.stringify({ ecosystem_size: "large", learning_curve: "gentle" })
      }
    ];

    // Default projects
    const defaultProjects: InsertProject[] = [
      {
        name: "E-commerce Platform Rewrite",
        description: "A complete rewrite of our flagship e-commerce platform using modern technologies and architecture.",
        status: "active",
        website: "https://example.com/ecommerce",
        repository: "https://github.com/example/ecommerce-rewrite",
        image: "https://via.placeholder.com/300x200?text=E-commerce"
      },
      {
        name: "Internal Dashboard",
        description: "A dashboard application for internal teams to monitor KPIs and manage operations.",
        status: "completed",
        website: "https://dashboard.internal.example.com",
        repository: "https://github.com/example/internal-dashboard",
        image: "https://via.placeholder.com/300x200?text=Dashboard"
      },
      {
        name: "API Gateway",
        description: "A centralized API gateway for all our services with authentication, rate limiting, and logging.",
        status: "active",
        website: null,
        repository: "https://github.com/example/api-gateway",
        image: "https://via.placeholder.com/300x200?text=API+Gateway"
      },
      {
        name: "Mobile App",
        description: "A native mobile application for customers to interact with our services on the go.",
        status: "planned",
        website: null,
        repository: "https://github.com/example/mobile-app",
        image: "https://via.placeholder.com/300x200?text=Mobile+App"
      },
      {
        name: "Search Service",
        description: "A specialized search service with advanced filtering, faceting, and ranking.",
        status: "active",
        website: null,
        repository: "https://github.com/example/search-service",
        image: "https://via.placeholder.com/300x200?text=Search+Service"
      },
      {
        name: "Content Management System",
        description: "A headless CMS for managing website content, blog posts, and marketing materials.",
        status: "active",
        website: "https://cms.example.com",
        repository: "https://github.com/example/cms",
        image: "https://via.placeholder.com/300x200?text=CMS"
      },
      {
        name: "Recommendation Engine",
        description: "An AI-powered recommendation system using machine learning to personalize user experiences.",
        status: "active",
        website: "https://recommendation.example.com",
        repository: "https://github.com/example/recommendation-engine",
        image: "https://via.placeholder.com/300x200?text=Recommendation+Engine"
      }
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

    // Add default projects
    const createdProjects: Project[] = [];
    defaultProjects.forEach(project => {
      this.createProject(project).then(createdProject => {
        createdProjects.push(createdProject);
      });
    });

    // Setup technology-project relationships
    setTimeout(() => {
      // Example tech-project links
      const techProjectLinks: InsertTechnologyProject[] = [
        // E-commerce Platform
        { technology_id: 1, project_id: 1, notes: "Main frontend framework" }, // React
        { technology_id: 6, project_id: 1, notes: "Used for type safety" }, // TypeScript
        { technology_id: 21, project_id: 1, notes: "Used for frontend styling" }, // TailwindCSS
        { technology_id: 20, project_id: 1, notes: "Used for server-side rendering" }, // Next.js
        { technology_id: 22, project_id: 1, notes: "Main database" }, // PostgreSQL
        { technology_id: 24, project_id: 1, notes: "Used for caching" }, // Redis
        { technology_id: 26, project_id: 1, notes: "Used for database access" }, // Prisma
        
        // Internal Dashboard
        { technology_id: 1, project_id: 2, notes: "Frontend framework" }, // React
        { technology_id: 6, project_id: 2, notes: "Used for type safety" }, // TypeScript
        { technology_id: 21, project_id: 2, notes: "Used for styling" }, // TailwindCSS
        { technology_id: 23, project_id: 2, notes: "Database for dashboard data" }, // MongoDB
        
        // API Gateway
        { technology_id: 18, project_id: 3, notes: "Main language for the gateway" }, // Go
        { technology_id: 24, project_id: 3, notes: "Used for rate limiting" }, // Redis
        { technology_id: 5, project_id: 3, notes: "Used for containerization" }, // Docker
        { technology_id: 4, project_id: 3, notes: "Used for orchestration" }, // Kubernetes
        
        // Mobile App
        { technology_id: 19, project_id: 4, notes: "Main language for Android" }, // Kotlin
        { technology_id: 6, project_id: 4, notes: "Used for type safety in shared code" }, // TypeScript
        
        // Search Service
        { technology_id: 18, project_id: 5, notes: "Main implementation language" }, // Go
        { technology_id: 5, project_id: 5, notes: "Used for containerization" }, // Docker
        { technology_id: 4, project_id: 5, notes: "Used for orchestration" }, // Kubernetes
        
        // CMS
        { technology_id: 3, project_id: 6, notes: "Used for admin interface" }, // Vue.js
        { technology_id: 6, project_id: 6, notes: "Used for type safety" }, // TypeScript
        { technology_id: 22, project_id: 6, notes: "Main database" }, // PostgreSQL
        { technology_id: 21, project_id: 6, notes: "Used for styling" }, // TailwindCSS

        // Link Python and related technologies to projects
        { technology_id: 27, project_id: 5, notes: "Used for data processing pipeline" }, // Python
        { technology_id: 29, project_id: 3, notes: "Used for admin dashboard" }, // Django
        { technology_id: 30, project_id: 2, notes: "Used for internal APIs" }, // Flask
        { technology_id: 32, project_id: 5, notes: "Machine learning models for search ranking" }, // TensorFlow
        { technology_id: 33, project_id: 5, notes: "Alternative ML library used for recommendation engine" }, // PyTorch

        // Link Java and Spring Boot to projects
        { technology_id: 28, project_id: 1, notes: "Backend services for inventory management" }, // Java
        { technology_id: 31, project_id: 1, notes: "Framework for Java microservices" }, // Spring Boot
        { technology_id: 28, project_id: 3, notes: "Used for performance-critical services" }, // Java
        
        // Recommendation Engine Project
        { technology_id: 27, project_id: 7, notes: "Main development language" }, // Python
        { technology_id: 32, project_id: 7, notes: "Main machine learning framework" }, // TensorFlow
        { technology_id: 33, project_id: 7, notes: "Used for specialized neural network models" }, // PyTorch
        { technology_id: 22, project_id: 7, notes: "Database for storing user preferences" }, // PostgreSQL
        { technology_id: 24, project_id: 7, notes: "Caching for recommendation results" } // Redis
      ];
      
      techProjectLinks.forEach(link => {
        this.linkTechnologyToProject(link);
      });
    }, 100); // Small delay to ensure projects are created first
  }

  // Technology methods
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
