import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import WorkflowStepper, { type Step } from "@/components/WorkflowStepper";
import TopicInput from "@/components/TopicInput";
import ScriptEditor from "@/components/ScriptEditor";
import ImageManager, { type SceneImage } from "@/components/ImageManager";
import AudioControls from "@/components/AudioControls";
import VideoPreview from "@/components/VideoPreview";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const WORKFLOW_STEPS: Step[] = [
  { id: 1, label: "Topic", description: "Enter idea" },
  { id: 2, label: "Script", description: "Review & edit" },
  { id: 3, label: "Images", description: "Customize scenes" },
  { id: 4, label: "Audio", description: "Voice & music" },
  { id: 5, label: "Video", description: "Preview & export" }
];

interface Scene {
  id: number;
  text: string;
  imageUrl?: string;
  duration: number;
}

interface Project {
  id: string;
  topic: string;
  scenes: Scene[];
  status: string;
}

export default function Home() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedMusic, setSelectedMusic] = useState("upbeat1");

  const musicTracks = [
    { id: 'upbeat1', name: 'Uplifting Morning', category: 'Inspirational' },
    { id: 'chill1', name: 'Calm Focus', category: 'Ambient' },
    { id: 'energetic1', name: 'High Energy', category: 'Upbeat' },
    { id: 'minimal1', name: 'Minimal Piano', category: 'Classical' }
  ];

  const generateScriptMutation = useMutation({
    mutationFn: async (topic: string) => {
      const response = await apiRequest('POST', '/api/generate-script', { topic });
      const data = await response.json();
      
      if (!data.success || !data.project) {
        throw new Error(data.error || "Failed to generate script");
      }
      
      if (!data.project.scenes || data.project.scenes.length === 0) {
        throw new Error("No scenes were generated. Please try a different topic.");
      }
      
      return data;
    },
    onSuccess: (data: any) => {
      setCurrentProject(data.project);
      setCurrentStep(2);
      toast({
        title: "Script Generated!",
        description: `Created ${data.project.scenes.length} scenes for your video.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Script Generation Failed",
        description: error.message || "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateImagesMutation = useMutation({
    mutationFn: async () => {
      if (!currentProject) throw new Error("No project found");
      
      const response = await apiRequest('POST', '/api/generate-images', {
        projectId: currentProject.id,
        scenes: currentProject.scenes.map(s => ({ id: s.id, text: s.text })),
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentProject(data.project);
      toast({
        title: "Images Generated!",
        description: "AI has created images for all your scenes.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate images.",
        variant: "destructive",
      });
    },
  });

  const regenerateImageMutation = useMutation({
    mutationFn: async (sceneId: number) => {
      if (!currentProject) throw new Error("No project found");
      
      const response = await apiRequest('POST', `/api/regenerate-image/${currentProject.id}/${sceneId}`);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentProject(data.project);
      toast({
        title: "Image Regenerated",
        description: "New image created for the scene.",
      });
    },
  });

  const updateScriptMutation = useMutation({
    mutationFn: async (scenes: Scene[]) => {
      if (!currentProject) throw new Error("No project found");
      
      const response = await apiRequest('PATCH', `/api/projects/${currentProject.id}/script`, { scenes });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentProject(data.project);
    },
  });

  const updateDurationMutation = useMutation({
    mutationFn: async ({ sceneId, duration }: { sceneId: number; duration: number }) => {
      if (!currentProject) throw new Error("No project found");
      
      const response = await apiRequest('PATCH', `/api/projects/${currentProject.id}/scenes/${sceneId}/duration`, { duration });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setCurrentProject(data.project);
    },
  });

  const handleGenerateScript = (topic: string) => {
    generateScriptMutation.mutate(topic);
  };

  const handleApproveScript = (scenes: any[]) => {
    updateScriptMutation.mutate(scenes, {
      onSuccess: () => {
        generateImagesMutation.mutate();
        setCurrentStep(3);
      },
    });
  };

  const handleContinueToAudio = () => {
    setCurrentStep(4);
  };

  const handleContinueToVideo = () => {
    setCurrentStep(5);
  };

  const imageScenes: SceneImage[] = currentProject?.scenes.map(s => ({
    id: s.id,
    imageUrl: s.imageUrl || `https://images.unsplash.com/photo-${Date.now()}-${s.id}?w=800&h=600&fit=crop`,
    duration: s.duration,
    sceneText: s.text,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold flex items-center gap-2" data-testid="heading-app-title">
              <Sparkles className="w-6 h-6 text-primary" />
              AI Video Creator
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Create engaging social media videos with AI
            </p>
          </div>
        </div>
      </header>

      <WorkflowStepper 
        steps={WORKFLOW_STEPS} 
        currentStep={currentStep}
        onStepClick={(stepId) => {
          if (stepId <= currentStep && currentProject) {
            setCurrentStep(stepId);
          }
        }}
      />

      <main className="pb-12">
        {currentStep === 1 && (
          <TopicInput 
            onGenerate={handleGenerateScript}
            isGenerating={generateScriptMutation.isPending}
          />
        )}

        {currentStep === 2 && currentProject && (
          <ScriptEditor
            initialScript={currentProject.scenes}
            onRegenerateScene={(id) => {
              toast({
                title: "Feature Coming Soon",
                description: "Individual scene regeneration will be available soon.",
              });
            }}
            onRegenerateAll={() => {
              if (currentProject) {
                generateScriptMutation.mutate(currentProject.topic);
              }
            }}
            onApprove={handleApproveScript}
            isRegenerating={generateScriptMutation.isPending || updateScriptMutation.isPending}
          />
        )}

        {currentStep === 3 && currentProject && (
          <ImageManager
            scenes={imageScenes}
            onRegenerateImage={(id) => regenerateImageMutation.mutate(id)}
            onUploadImage={(id, file) => {
              toast({
                title: "Feature Coming Soon",
                description: "Image upload will be available soon.",
              });
            }}
            onDurationChange={(id, duration) => {
              updateDurationMutation.mutate({ sceneId: id, duration });
            }}
            onContinue={handleContinueToAudio}
            isGenerating={generateImagesMutation.isPending || regenerateImageMutation.isPending}
          />
        )}

        {currentStep === 4 && currentProject && (
          <AudioControls
            voiceoverUrl="/mock-voiceover.mp3"
            onRegenerateVoice={() => {
              toast({
                title: "Feature Coming Soon",
                description: "AI voiceover generation will be available soon.",
              });
            }}
            musicTracks={musicTracks}
            selectedMusicId={selectedMusic}
            onSelectMusic={setSelectedMusic}
            onVoiceVolumeChange={(vol) => console.log('Voice vol:', vol)}
            onMusicVolumeChange={(vol) => console.log('Music vol:', vol)}
            onContinue={handleContinueToVideo}
            isGenerating={false}
          />
        )}

        {currentStep === 5 && currentProject && (
          <VideoPreview
            scenes={currentProject.scenes}
            voiceVolume={100}
            musicVolume={30}
            musicTrackId={selectedMusic}
            isRendering={false}
            onRestart={() => {
              setCurrentStep(1);
              setCurrentProject(null);
            }}
            onDownload={() => {
              toast({
                title: "Yuklab Olish Funksiyasi",
                description: "To'liq video fayl yaratish uchun server-side rendering (FFmpeg) kerak. Hozircha faqat preview mavjud.",
                variant: "default",
              });
            }}
          />
        )}
      </main>
    </div>
  );
}
