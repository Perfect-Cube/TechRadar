import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Technology model representing individual technologies in the radar
export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quadrant: integer("quadrant").notNull(), // 0-3 for the four quadrants
  ring: integer("ring").notNull(), // 0-3 for the four rings (adopt, trial, assess, hold)
  description: text("description").notNull(),
  website: text("website"), // Optional website URL for the technology
  tags: text("tags").array(), // Array of tags for better categorization
  custom_properties: text("custom_properties"), // JSON string for custom properties
});

// Quadrant labels
export const quadrants = pgTable("quadrants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color"), // Custom color for the quadrant
});

// Ring labels
export const rings = pgTable("rings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color"), // Custom color for the ring
});

// Projects that use the technologies
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image"), // URL or path to project image
  website: text("website"), // Project website URL
  repository: text("repository"), // Repository URL
  status: text("status").notNull(), // e.g., 'active', 'completed', 'planned'
});

// Technology-project associations (many-to-many)
export const technologyProjects = pgTable("technology_projects", {
  id: serial("id").primaryKey(),
  technology_id: integer("technology_id").notNull(), // Reference to technology
  project_id: integer("project_id").notNull(), // Reference to project
  notes: text("notes"), // Optional notes about this technology in this project
});

// Insert schemas
export const insertTechnologySchema = createInsertSchema(technologies).omit({
  id: true,
});

export const insertQuadrantSchema = createInsertSchema(quadrants).omit({
  id: true,
});

export const insertRingSchema = createInsertSchema(rings).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertTechnologyProjectSchema = createInsertSchema(technologyProjects).omit({
  id: true,
});

// Types
export type InsertTechnology = z.infer<typeof insertTechnologySchema>;
export type Technology = typeof technologies.$inferSelect;

export type InsertQuadrant = z.infer<typeof insertQuadrantSchema>;
export type Quadrant = typeof quadrants.$inferSelect;

export type InsertRing = z.infer<typeof insertRingSchema>;
export type Ring = typeof rings.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertTechnologyProject = z.infer<typeof insertTechnologyProjectSchema>;
export type TechnologyProject = typeof technologyProjects.$inferSelect;
