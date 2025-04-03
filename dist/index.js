// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  technologies;
  quadrants;
  rings;
  projects;
  technologyProjects;
  techCurrentId;
  quadrantCurrentId;
  ringCurrentId;
  projectCurrentId;
  techProjectCurrentId;
  constructor() {
    this.technologies = /* @__PURE__ */ new Map();
    this.quadrants = /* @__PURE__ */ new Map();
    this.rings = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.technologyProjects = /* @__PURE__ */ new Map();
    this.techCurrentId = 1;
    this.quadrantCurrentId = 1;
    this.ringCurrentId = 1;
    this.projectCurrentId = 1;
    this.techProjectCurrentId = 1;
    this.initializeData();
  }
  initializeData() {
    this.technologies.clear();
    this.quadrants.clear();
    this.rings.clear();
    this.projects.clear();
    this.technologyProjects.clear();
    this.techCurrentId = 1;
    this.quadrantCurrentId = 1;
    this.ringCurrentId = 1;
    this.projectCurrentId = 1;
    this.techProjectCurrentId = 1;
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
    this.createTechnology({ name: "Claude Sonnet", description: "AI assistant model from Anthropic", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "Tuple", description: "Remote pair programming tool", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "YOLO", description: "Real-time object detection system", quadrant: 1, ring: 0 });
    this.createTechnology({ name: "D2", description: "Declarative diagramming language", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "metabase", description: "Business intelligence and analytics tool", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "Anything LLM", description: "Open-source ChatGPT alternative", quadrant: 1, ring: 1 });
    this.createTechnology({ name: "GraphRAG", description: "Graph-based Retrieval Augmented Generation", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Small language models", description: "Smaller, efficient AI language models", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Model Distillation", description: "Technique to create smaller models from larger ones", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Prompt Engineering", description: "Designing effective prompts for AI models", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Mixed reality", description: "Blend of physical and digital worlds", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Ambient Computing", description: "Technology integrated into environment", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Explainable AI", description: "AI systems with understandable decisions", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Multimodal AI", description: "AI that handles multiple input/output types", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Shadow AI mastering", description: "AI mastering process", quadrant: 0, ring: 0 });
    this.createTechnology({ name: "Quantum computing", description: "Computing based on quantum mechanics", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Quantum Sensing", description: "Detecting signals using quantum properties", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Edge Computing", description: "Processing data near the source", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Adaptive AI", description: "AI that adapts to changing conditions", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Advanced Swarm Systems", description: "Decentralized, self-organized systems", quadrant: 0, ring: 1 });
    this.createTechnology({ name: "Wearable Technologies", description: "Computing devices worn on body", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "HMO", description: "Health maintenance organization", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "Digital Identity", description: "Electronic verification of identity", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "5G/6G", description: "Mobile network technologies", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "3D Data visualization", description: "Visual representation of data in 3D", quadrant: 0, ring: 2 });
    this.createTechnology({ name: "Crew AI", description: "AI framework for team collaboration", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langraph", description: "Graph-based framework for language models", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Agony", description: "Framework for efficient data processing", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langchain", description: "Framework for developing applications powered by language models", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Langsmith", description: "Developer platform for LLM applications", quadrant: 2, ring: 0 });
    this.createTechnology({ name: "Trino", description: "Distributed SQL query engine", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Gitlab CI/CD", description: "Continuous integration and delivery platform", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Deepseek R1", description: "AI platform for research", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Chain loop", description: "Software supply chain management platform", quadrant: 3, ring: 0 });
    this.createTechnology({ name: "Railway", description: "Application deployment platform", quadrant: 3, ring: 1 });
    const techRadar = this.createProject({
      name: "VW Tech Radar",
      description: "Visualization tool for technology choices and assessment",
      status: "active"
    });
  }
  async getTechnology(id) {
    return this.technologies.get(id);
  }
  async getTechnologies() {
    return Array.from(this.technologies.values());
  }
  async searchTechnologies(query) {
    if (!query || query.trim() === "") {
      return this.getTechnologies();
    }
    const lowerQuery = query.toLowerCase();
    return Array.from(this.technologies.values()).filter((tech) => {
      const nameMatch = tech.name.toLowerCase().includes(lowerQuery);
      const descMatch = tech.description.toLowerCase().includes(lowerQuery);
      const tagsMatch = tech.tags ? tech.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) : false;
      return nameMatch || descMatch || tagsMatch;
    });
  }
  async createTechnology(insertTechnology) {
    const id = this.techCurrentId++;
    const technology = {
      ...insertTechnology,
      id,
      website: insertTechnology.website || null,
      tags: insertTechnology.tags || [],
      custom_properties: insertTechnology.custom_properties || null
    };
    this.technologies.set(id, technology);
    return technology;
  }
  async updateTechnology(id, technologyUpdate) {
    const existingTech = this.technologies.get(id);
    if (!existingTech) {
      return void 0;
    }
    const updatedTech = { ...existingTech, ...technologyUpdate };
    this.technologies.set(id, updatedTech);
    return updatedTech;
  }
  // Quadrant methods
  async getQuadrant(id) {
    return this.quadrants.get(id);
  }
  async getQuadrants() {
    return Array.from(this.quadrants.values());
  }
  async createQuadrant(insertQuadrant) {
    const id = this.quadrantCurrentId++;
    const quadrant = {
      ...insertQuadrant,
      id,
      color: insertQuadrant.color || null
    };
    this.quadrants.set(id, quadrant);
    return quadrant;
  }
  async updateQuadrant(id, quadrantUpdate) {
    const existingQuadrant = this.quadrants.get(id);
    if (!existingQuadrant) {
      return void 0;
    }
    const updatedQuadrant = { ...existingQuadrant, ...quadrantUpdate };
    this.quadrants.set(id, updatedQuadrant);
    return updatedQuadrant;
  }
  // Ring methods
  async getRing(id) {
    return this.rings.get(id);
  }
  async getRings() {
    return Array.from(this.rings.values());
  }
  async createRing(insertRing) {
    const id = this.ringCurrentId++;
    const ring = {
      ...insertRing,
      id,
      color: insertRing.color || null
    };
    this.rings.set(id, ring);
    return ring;
  }
  async updateRing(id, ringUpdate) {
    const existingRing = this.rings.get(id);
    if (!existingRing) {
      return void 0;
    }
    const updatedRing = { ...existingRing, ...ringUpdate };
    this.rings.set(id, updatedRing);
    return updatedRing;
  }
  // Project methods
  async getProject(id) {
    return this.projects.get(id);
  }
  async getProjects() {
    return Array.from(this.projects.values());
  }
  async getProjectsByTechnology(technologyId) {
    const projectIds = /* @__PURE__ */ new Set();
    Array.from(this.technologyProjects.values()).forEach((tp) => {
      if (tp.technology_id === technologyId) {
        projectIds.add(tp.project_id);
      }
    });
    return Array.from(this.projects.values()).filter(
      (project) => projectIds.has(project.id)
    );
  }
  async createProject(insertProject) {
    const id = this.projectCurrentId++;
    const project = {
      ...insertProject,
      id,
      website: insertProject.website || null,
      image: insertProject.image || null,
      repository: insertProject.repository || null
    };
    this.projects.set(id, project);
    return project;
  }
  async updateProject(id, projectUpdate) {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      return void 0;
    }
    const updatedProject = { ...existingProject, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  // Technology-Project relationship methods
  async linkTechnologyToProject(techProjectLink) {
    const id = this.techProjectCurrentId++;
    const link = {
      ...techProjectLink,
      id,
      notes: techProjectLink.notes || null
    };
    this.technologyProjects.set(id, link);
    return link;
  }
  async getTechnologiesForProject(projectId) {
    const technologyIds = /* @__PURE__ */ new Set();
    Array.from(this.technologyProjects.values()).forEach((tp) => {
      if (tp.project_id === projectId) {
        technologyIds.add(tp.technology_id);
      }
    });
    return Array.from(this.technologies.values()).filter(
      (tech) => technologyIds.has(tech.id)
    );
  }
  async getProjectsForTechnology(technologyId) {
    const projectIds = /* @__PURE__ */ new Set();
    Array.from(this.technologyProjects.values()).forEach((tp) => {
      if (tp.technology_id === technologyId) {
        projectIds.add(tp.project_id);
      }
    });
    return Array.from(this.projects.values()).filter(
      (project) => projectIds.has(project.id)
    );
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quadrant: integer("quadrant").notNull(),
  // 0-3 for the four quadrants
  ring: integer("ring").notNull(),
  // 0-3 for the four rings (adopt, trial, assess, hold)
  description: text("description").notNull(),
  website: text("website"),
  // Optional website URL for the technology
  tags: text("tags").array(),
  // Array of tags for better categorization
  custom_properties: text("custom_properties")
  // JSON string for custom properties
});
var quadrants = pgTable("quadrants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color")
  // Custom color for the quadrant
});
var rings = pgTable("rings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color")
  // Custom color for the ring
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  // URL or path to project image
  website: text("website"),
  // Project website URL
  repository: text("repository"),
  // Repository URL
  status: text("status").notNull()
  // e.g., 'active', 'completed', 'planned'
});
var technologyProjects = pgTable("technology_projects", {
  id: serial("id").primaryKey(),
  technology_id: integer("technology_id").notNull(),
  // Reference to technology
  project_id: integer("project_id").notNull(),
  // Reference to project
  notes: text("notes")
  // Optional notes about this technology in this project
});
var insertTechnologySchema = createInsertSchema(technologies).omit({
  id: true
});
var insertQuadrantSchema = createInsertSchema(quadrants).omit({
  id: true
});
var insertRingSchema = createInsertSchema(rings).omit({
  id: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true
});
var insertTechnologyProjectSchema = createInsertSchema(technologyProjects).omit({
  id: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/technologies", async (req, res) => {
    try {
      const searchQuery = req.query.q;
      if (searchQuery) {
        const technologies2 = await storage.searchTechnologies(searchQuery);
        return res.json(technologies2);
      } else {
        const technologies2 = await storage.getTechnologies();
        return res.json(technologies2);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch technologies" });
    }
  });
  app2.get("/api/technologies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const technology = await storage.getTechnology(id);
      if (!technology) {
        return res.status(404).json({ message: "Technology not found" });
      }
      res.json(technology);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch technology" });
    }
  });
  app2.post("/api/technologies", async (req, res) => {
    try {
      const validatedData = insertTechnologySchema.parse(req.body);
      const newTechnology = await storage.createTechnology(validatedData);
      res.status(201).json(newTechnology);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid technology data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create technology" });
    }
  });
  app2.patch("/api/technologies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const partialSchema = insertTechnologySchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const updatedTechnology = await storage.updateTechnology(id, validatedData);
      if (!updatedTechnology) {
        return res.status(404).json({ message: "Technology not found" });
      }
      res.json(updatedTechnology);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid technology data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update technology" });
    }
  });
  app2.get("/api/quadrants", async (req, res) => {
    try {
      const quadrants2 = await storage.getQuadrants();
      res.json(quadrants2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quadrants" });
    }
  });
  app2.get("/api/quadrants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const quadrant = await storage.getQuadrant(id);
      if (!quadrant) {
        return res.status(404).json({ message: "Quadrant not found" });
      }
      res.json(quadrant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quadrant" });
    }
  });
  app2.post("/api/quadrants", async (req, res) => {
    try {
      const validatedData = insertQuadrantSchema.parse(req.body);
      const newQuadrant = await storage.createQuadrant(validatedData);
      res.status(201).json(newQuadrant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quadrant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quadrant" });
    }
  });
  app2.patch("/api/quadrants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const partialSchema = insertQuadrantSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const updatedQuadrant = await storage.updateQuadrant(id, validatedData);
      if (!updatedQuadrant) {
        return res.status(404).json({ message: "Quadrant not found" });
      }
      res.json(updatedQuadrant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quadrant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update quadrant" });
    }
  });
  app2.get("/api/rings", async (req, res) => {
    try {
      const rings2 = await storage.getRings();
      res.json(rings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rings" });
    }
  });
  app2.get("/api/rings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const ring = await storage.getRing(id);
      if (!ring) {
        return res.status(404).json({ message: "Ring not found" });
      }
      res.json(ring);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ring" });
    }
  });
  app2.post("/api/rings", async (req, res) => {
    try {
      const validatedData = insertRingSchema.parse(req.body);
      const newRing = await storage.createRing(validatedData);
      res.status(201).json(newRing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ring data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ring" });
    }
  });
  app2.patch("/api/rings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const partialSchema = insertRingSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const updatedRing = await storage.updateRing(id, validatedData);
      if (!updatedRing) {
        return res.status(404).json({ message: "Ring not found" });
      }
      res.json(updatedRing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ring data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update ring" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  app2.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      const partialSchema = insertProjectSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const updatedProject = await storage.updateProject(id, validatedData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  app2.get("/api/technologies/:id/projects", async (req, res) => {
    try {
      const techId = parseInt(req.params.id);
      if (isNaN(techId)) {
        return res.status(400).json({ message: "Invalid technology ID format" });
      }
      const projects2 = await storage.getProjectsForTechnology(techId);
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects for technology" });
    }
  });
  app2.get("/api/projects/:id/technologies", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID format" });
      }
      const technologies2 = await storage.getTechnologiesForProject(projectId);
      res.json(technologies2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch technologies for project" });
    }
  });
  app2.post("/api/technology-projects", async (req, res) => {
    try {
      const validatedData = insertTechnologyProjectSchema.parse(req.body);
      const newLink = await storage.linkTechnologyToProject(validatedData);
      res.status(201).json(newLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid technology-project link data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to link technology to project" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
