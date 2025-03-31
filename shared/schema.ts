import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Technology model representing individual technologies in the radar
export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quadrant: integer("quadrant").notNull(), // 0-3 for the four quadrants
  ring: integer("ring").notNull(), // 0-3 for the four rings (adopt, trial, assess, hold)
  description: text("description").notNull(),
});

// Quadrant labels
export const quadrants = pgTable("quadrants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

// Ring labels
export const rings = pgTable("rings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
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

// Types
export type InsertTechnology = z.infer<typeof insertTechnologySchema>;
export type Technology = typeof technologies.$inferSelect;

export type InsertQuadrant = z.infer<typeof insertQuadrantSchema>;
export type Quadrant = typeof quadrants.$inferSelect;

export type InsertRing = z.infer<typeof insertRingSchema>;
export type Ring = typeof rings.$inferSelect;
