import { type VideoProject, type InsertVideoProject, videoProjectSchema, type Scene } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createProject(project: InsertVideoProject): Promise<VideoProject>;
  getProject(id: string): Promise<VideoProject | undefined>;
  updateProject(id: string, updates: Partial<VideoProject>): Promise<VideoProject | undefined>;
  listProjects(): Promise<VideoProject[]>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, VideoProject>;

  constructor() {
    this.projects = new Map();
  }

  async createProject(insertProject: InsertVideoProject): Promise<VideoProject> {
    const id = randomUUID();
    
    const scenesWithDefaults = insertProject.scenes.map(scene => ({
      id: scene.id,
      text: scene.text,
      imageUrl: scene.imageUrl,
      duration: scene.duration ?? 4,
    }));
    
    const project: VideoProject = {
      topic: insertProject.topic,
      scenes: scenesWithDefaults,
      status: insertProject.status || 'draft',
      voiceVolume: insertProject.voiceVolume ?? 100,
      musicVolume: insertProject.musicVolume ?? 30,
      voiceoverUrl: insertProject.voiceoverUrl,
      musicTrackId: insertProject.musicTrackId,
      videoUrl: insertProject.videoUrl,
      id,
      createdAt: new Date(),
    };
    
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: string): Promise<VideoProject | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: string, updates: Partial<VideoProject>): Promise<VideoProject | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated: VideoProject = {
      ...project,
      ...updates,
      scenes: updates.scenes 
        ? updates.scenes.map(scene => ({
            id: scene.id,
            text: scene.text,
            imageUrl: scene.imageUrl ?? project.scenes.find(s => s.id === scene.id)?.imageUrl,
            duration: scene.duration ?? project.scenes.find(s => s.id === scene.id)?.duration ?? 4,
          }))
        : project.scenes,
    };
    
    this.projects.set(id, updated);
    return updated;
  }

  async listProjects(): Promise<VideoProject[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new MemStorage();
