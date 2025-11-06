import { z } from "zod";

export const sceneSchema = z.object({
  id: z.number(),
  text: z.string(),
  imageUrl: z.string().optional(),
  duration: z.number().default(4),
});

export const videoProjectSchema = z.object({
  id: z.string(),
  topic: z.string(),
  scenes: z.array(sceneSchema),
  voiceoverUrl: z.string().optional(),
  musicTrackId: z.string().optional(),
  voiceVolume: z.number().default(100),
  musicVolume: z.number().default(30),
  videoUrl: z.string().optional(),
  status: z.enum(['draft', 'script_generated', 'images_generated', 'audio_generated', 'video_ready']).default('draft'),
  createdAt: z.date().optional(),
});

export type Scene = z.infer<typeof sceneSchema>;
export type VideoProject = z.infer<typeof videoProjectSchema>;
export type InsertVideoProject = Omit<VideoProject, 'id' | 'createdAt'>;

export const generateScriptRequestSchema = z.object({
  topic: z.string().min(10, "Topic must be at least 10 characters"),
});

export const generateImagesRequestSchema = z.object({
  projectId: z.string(),
  scenes: z.array(z.object({
    id: z.number(),
    text: z.string(),
  })),
});

export const generateVoiceoverRequestSchema = z.object({
  projectId: z.string(),
  scriptText: z.string(),
});

export const assembleVideoRequestSchema = z.object({
  projectId: z.string(),
  scenes: z.array(z.object({
    id: z.number(),
    imageUrl: z.string(),
    duration: z.number(),
  })),
  voiceoverUrl: z.string(),
  musicTrackId: z.string().optional(),
  musicVolume: z.number().default(30),
});
