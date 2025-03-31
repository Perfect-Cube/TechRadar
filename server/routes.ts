import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTechnologySchema, 
  insertQuadrantSchema, 
  insertRingSchema,
  insertProjectSchema,
  insertTechnologyProjectSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the Tech Radar
  
  // Technologies endpoints
  app.get("/api/technologies", async (req, res) => {
    try {
      // Handle search query if present
      const searchQuery = req.query.q as string;
      
      if (searchQuery) {
        const technologies = await storage.searchTechnologies(searchQuery);
        return res.json(technologies);
      } else {
        const technologies = await storage.getTechnologies();
        return res.json(technologies);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch technologies" });
    }
  });

  app.get("/api/technologies/:id", async (req, res) => {
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

  app.post("/api/technologies", async (req, res) => {
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

  app.patch("/api/technologies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Partial validation of the request body
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

  // Quadrants endpoints
  app.get("/api/quadrants", async (req, res) => {
    try {
      const quadrants = await storage.getQuadrants();
      res.json(quadrants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quadrants" });
    }
  });

  app.get("/api/quadrants/:id", async (req, res) => {
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

  app.post("/api/quadrants", async (req, res) => {
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

  app.patch("/api/quadrants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Partial validation of the request body
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

  // Rings endpoints
  app.get("/api/rings", async (req, res) => {
    try {
      const rings = await storage.getRings();
      res.json(rings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rings" });
    }
  });

  app.get("/api/rings/:id", async (req, res) => {
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

  app.post("/api/rings", async (req, res) => {
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

  app.patch("/api/rings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Partial validation of the request body
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

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
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

  app.post("/api/projects", async (req, res) => {
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

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Partial validation of the request body
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

  // Technology-Project relation endpoints
  app.get("/api/technologies/:id/projects", async (req, res) => {
    try {
      const techId = parseInt(req.params.id);
      if (isNaN(techId)) {
        return res.status(400).json({ message: "Invalid technology ID format" });
      }

      const projects = await storage.getProjectsForTechnology(techId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects for technology" });
    }
  });

  app.get("/api/projects/:id/technologies", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID format" });
      }

      const technologies = await storage.getTechnologiesForProject(projectId);
      res.json(technologies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch technologies for project" });
    }
  });

  app.post("/api/technology-projects", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
