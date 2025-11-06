# AI Video Creator

An interactive web application for creating AI-powered social media videos (Instagram Reels, TikTok) with a guided multi-step workflow.

## Overview

This application helps users create engaging short-form videos by:
1. Generating AI-powered video scripts from topics (using Gemini AI)
2. Creating relevant images for each scene (using Unsplash Source API)
3. Allowing full customization of scenes, timing, and content
4. (Planned) Generating voiceovers and assembling final videos

## Recent Changes

- **2024-11-06**: Initial implementation
  - Implemented Gemini AI integration for script generation
  - Added Unsplash Source API for scene images
  - Created 5-step workflow UI (Topic → Script → Images → Audio → Video)
  - Implemented in-memory storage for video projects
  - Added proper error handling and validation

## Project Architecture

### Frontend (`client/`)
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: TanStack Query for server state
- **Components**:
  - `WorkflowStepper`: Progress indicator for 5-step process
  - `TopicInput`: Initial topic entry form
  - `ScriptEditor`: Edit AI-generated scripts with scene-by-scene control
  - `ImageManager`: View and regenerate scene images
  - `AudioControls`: (Placeholder) Voice and music controls
  - `VideoPreview`: (Placeholder) Final video preview and download

### Backend (`server/`)
- **Framework**: Express.js
- **AI Integration**: Google Gemini AI (`@google/generative-ai`)
- **Storage**: In-memory storage (MemStorage class)
- **Key Modules**:
  - `gemini.ts`: Gemini AI integration for script generation
  - `routes.ts`: API endpoints for all operations
  - `storage.ts`: Data persistence interface

### API Endpoints

- `POST /api/generate-script` - Generate script from topic using Gemini
- `POST /api/generate-images` - Generate images for all scenes
- `POST /api/regenerate-image/:projectId/:sceneId` - Regenerate single scene image
- `PATCH /api/projects/:projectId/script` - Update project script
- `PATCH /api/projects/:projectId/scenes/:sceneId/duration` - Update scene duration
- `GET /api/projects/:projectId` - Get project by ID

### Data Schema (`shared/schema.ts`)

Main types:
- `VideoProject`: Complete video project with metadata
- `Scene`: Individual scene with text, image, and duration
- Request/response validation schemas using Zod

## User Preferences

- Language: Uzbek and English mixed
- AI Provider: Google Gemini (GEMINI_API_KEY required)
- Image Source: Unsplash Source API (no key required)

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini API
- **Images**: Unsplash Source API
- **Data Validation**: Zod

## Environment Variables

Required:
- `GEMINI_API_KEY` - Google Gemini API key for script generation

## Current Limitations

1. **Voiceover**: AI voiceover generation not yet implemented (planned with text-to-speech)
2. **Video Assembly**: Video rendering not yet implemented (planned with MoviePy/FFmpeg)
3. **Storage**: Uses in-memory storage (data lost on server restart)
4. **Image Generation**: Uses stock images from Unsplash, not AI-generated
5. **Music**: Background music tracks are placeholders

## Next Steps

1. Implement voiceover generation (TTS API integration)
2. Implement video assembly (MoviePy or FFmpeg)
3. Add persistent storage (optional: PostgreSQL)
4. Add user authentication for project management
5. Implement actual background music integration
