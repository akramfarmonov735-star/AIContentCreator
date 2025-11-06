import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateScript, generateImagePrompt } from "./gemini";
import { 
  generateScriptRequestSchema,
  generateImagesRequestSchema,
  type Scene 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate script from topic using Gemini
  app.post("/api/generate-script", async (req, res) => {
    try {
      const validationResult = generateScriptRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid request: " + validationResult.error.errors[0]?.message || "Topic is required" 
        });
      }
      
      const { topic } = validationResult.data;
      
      const scenes = await generateScript(topic);
      
      if (!scenes || scenes.length === 0) {
        return res.status(500).json({
          success: false,
          error: "AI did not generate any scenes. Please try a different topic."
        });
      }
      
      const project = await storage.createProject({
        topic,
        scenes: scenes.map(s => ({ 
          id: s.id, 
          text: s.text,
          duration: 4 
        })),
        status: 'script_generated',
        voiceVolume: 100,
        musicVolume: 30,
      });

      res.json({ 
        success: true, 
        project 
      });
    } catch (error: any) {
      console.error("Script generation error:", error);
      
      const statusCode = error.message?.includes('Invalid request') ? 400 : 500;
      
      res.status(statusCode).json({ 
        success: false, 
        error: error.message || "Failed to generate script. Please try again." 
      });
    }
  });

  // Generate images for scenes (using Unsplash Source)
  app.post("/api/generate-images", async (req, res) => {
    try {
      const validationResult = generateImagesRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid request data" 
        });
      }
      
      const { projectId, scenes } = validationResult.data;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      // Generate image URLs using Unsplash Source for each scene
      const updatedScenes: Scene[] = scenes.map((scene) => {
        // Extract keywords from scene text for image search
        const keywords = scene.text
          .toLowerCase()
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 2)
          .join(',')
          .replace(/[^a-zA-Z0-9,]/g, '') || 'abstract';
        
        // Use Unsplash Source API with search keywords
        const randomSeed = Math.floor(Math.random() * 100000);
        const imageUrl = `https://source.unsplash.com/800x600/?${keywords}&sig=${randomSeed}`;
        
        return {
          id: scene.id,
          text: scene.text,
          imageUrl,
          duration: project.scenes.find(s => s.id === scene.id)?.duration || 4,
        };
      });

      const updated = await storage.updateProject(projectId, {
        scenes: updatedScenes,
        status: 'images_generated',
      });

      res.json({ 
        success: true, 
        project: updated 
      });
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to generate images" 
      });
    }
  });

  // Regenerate single scene image
  app.post("/api/regenerate-image/:projectId/:sceneId", async (req, res) => {
    try {
      const { projectId, sceneId } = req.params;
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      const sceneIdNum = parseInt(sceneId);
      const scene = project.scenes.find(s => s.id === sceneIdNum);
      
      if (!scene) {
        return res.status(404).json({ success: false, error: "Scene not found" });
      }

      // Extract keywords from scene text
      const keywords = scene.text
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3)
        .slice(0, 2)
        .join(',')
        .replace(/[^a-zA-Z0-9,]/g, '') || 'abstract';
      
      // Generate new image URL with different random seed
      const randomSeed = Math.floor(Math.random() * 100000);
      const imageUrl = `https://source.unsplash.com/800x600/?${keywords}&sig=${randomSeed}`;
      
      const updatedScenes = project.scenes.map(s => 
        s.id === sceneIdNum ? { ...s, imageUrl } : s
      );

      const updated = await storage.updateProject(projectId, {
        scenes: updatedScenes,
      });

      res.json({ 
        success: true, 
        project: updated 
      });
    } catch (error: any) {
      console.error("Image regeneration error:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to regenerate image" 
      });
    }
  });

  // Update scene duration
  app.patch("/api/projects/:projectId/scenes/:sceneId/duration", async (req, res) => {
    try {
      const { projectId, sceneId } = req.params;
      const { duration } = req.body;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      const sceneIdNum = parseInt(sceneId);
      const updatedScenes = project.scenes.map(s => 
        s.id === sceneIdNum ? { ...s, duration } : s
      );

      const updated = await storage.updateProject(projectId, {
        scenes: updatedScenes,
      });

      res.json({ 
        success: true, 
        project: updated 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update duration" 
      });
    }
  });

  // Get project
  app.get("/api/projects/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      res.json({ success: true, project });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to get project" 
      });
    }
  });

  // Update project script
  app.patch("/api/projects/:projectId/script", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { scenes } = req.body;
      
      const updated = await storage.updateProject(projectId, {
        scenes: scenes.map((s: any) => ({
          id: s.id,
          text: s.text,
          imageUrl: s.imageUrl,
          duration: s.duration || 4,
        })),
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      res.json({ success: true, project: updated });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to update script" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
