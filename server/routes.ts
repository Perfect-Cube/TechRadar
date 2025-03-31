import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTechnologySchema, insertQuadrantSchema, insertRingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the Tech Radar
  
  // Technologies endpoints
  app.get("/api/technologies", async (req, res) => {
    try {
      const technologies = await storage.getTechnologies();
      res.json(technologies);
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

  const httpServer = createServer(app);
  return httpServer;
}
