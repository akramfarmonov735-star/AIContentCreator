import { useState } from "react";
import WorkflowStepper, { type Step } from "@/components/WorkflowStepper";
import TopicInput from "@/components/TopicInput";
import ScriptEditor from "@/components/ScriptEditor";
import ImageManager, { type SceneImage } from "@/components/ImageManager";
import AudioControls from "@/components/AudioControls";
import VideoPreview from "@/components/VideoPreview";
import { Sparkles } from "lucide-react";

const WORKFLOW_STEPS: Step[] = [
  { id: 1, label: "Topic", description: "Enter idea" },
  { id: 2, label: "Script", description: "Review & edit" },
  { id: 3, label: "Images", description: "Customize scenes" },
  { id: 4, label: "Audio", description: "Voice & music" },
  { id: 5, label: "Video", description: "Preview & export" }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [scriptScenes, setScriptScenes] = useState([
    { id: 1, text: "Wake up at 5 AM and start your day with purpose. The early morning hours are when your mind is freshest." },
    { id: 2, text: "Hydrate immediately - drink a full glass of water to kickstart your metabolism." },
    { id: 3, text: "Exercise for 20 minutes. Even a quick workout releases endorphins and boosts energy." },
    { id: 4, text: "Plan your day with intention. Write down your top 3 priorities before checking your phone." }
  ]);

  const [imageScenes, setImageScenes] = useState<SceneImage[]>([
    { 
      id: 1, 
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
      duration: 4.5,
      sceneText: "Wake up at 5 AM and start your day with purpose."
    },
    { 
      id: 2, 
      imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop",
      duration: 3.5,
      sceneText: "Hydrate immediately - drink a full glass of water."
    },
    { 
      id: 3, 
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      duration: 5.0,
      sceneText: "Exercise for 20 minutes."
    },
    { 
      id: 4, 
      imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
      duration: 4.0,
      sceneText: "Plan your day with intention."
    }
  ]);

  const [selectedMusic, setSelectedMusic] = useState("upbeat1");

  const musicTracks = [
    { id: 'upbeat1', name: 'Uplifting Morning', category: 'Inspirational' },
    { id: 'chill1', name: 'Calm Focus', category: 'Ambient' },
    { id: 'energetic1', name: 'High Energy', category: 'Upbeat' },
    { id: 'minimal1', name: 'Minimal Piano', category: 'Classical' }
  ];

  const handleGenerateScript = (topic: string) => {
    console.log('Generating script for topic:', topic);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(2);
    }, 2000);
  };

  const handleApproveScript = (script: any) => {
    console.log('Script approved:', script);
    setScriptScenes(script);
    setCurrentStep(3);
  };

  const handleContinueToAudio = () => {
    console.log('Continue to audio');
    setCurrentStep(4);
  };

  const handleContinueToVideo = () => {
    console.log('Generate video preview');
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold flex items-center gap-2">
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
          if (stepId <= currentStep) {
            setCurrentStep(stepId);
          }
        }}
      />

      <main className="pb-12">
        {currentStep === 1 && (
          <TopicInput 
            onGenerate={handleGenerateScript}
            isGenerating={isGenerating}
          />
        )}

        {currentStep === 2 && (
          <ScriptEditor
            initialScript={scriptScenes}
            onRegenerateScene={(id) => console.log('Regenerate scene:', id)}
            onRegenerateAll={() => console.log('Regenerate all')}
            onApprove={handleApproveScript}
            isRegenerating={false}
          />
        )}

        {currentStep === 3 && (
          <ImageManager
            scenes={imageScenes}
            onRegenerateImage={(id) => console.log('Regenerate image:', id)}
            onUploadImage={(id, file) => console.log('Upload:', id, file)}
            onDurationChange={(id, duration) => {
              setImageScenes(prev => prev.map(scene => 
                scene.id === id ? { ...scene, duration } : scene
              ));
            }}
            onContinue={handleContinueToAudio}
            isGenerating={false}
          />
        )}

        {currentStep === 4 && (
          <AudioControls
            voiceoverUrl="/mock-voiceover.mp3"
            onRegenerateVoice={() => console.log('Regenerate voice')}
            musicTracks={musicTracks}
            selectedMusicId={selectedMusic}
            onSelectMusic={setSelectedMusic}
            onVoiceVolumeChange={(vol) => console.log('Voice vol:', vol)}
            onMusicVolumeChange={(vol) => console.log('Music vol:', vol)}
            onContinue={handleContinueToVideo}
            isGenerating={false}
          />
        )}

        {currentStep === 5 && (
          <VideoPreview
            videoUrl="/mock-video.mp4"
            isRendering={false}
            onRerender={() => console.log('Re-render')}
            onDownload={() => console.log('Download')}
          />
        )}
      </main>
    </div>
  );
}
