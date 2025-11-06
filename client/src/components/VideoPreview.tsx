import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Scene {
  id: number;
  text: string;
  imageUrl?: string;
  duration: number;
}

interface VideoPreviewProps {
  scenes: Scene[];
  voiceVolume?: number;
  musicVolume?: number;
  musicTrackId?: string;
  isRendering?: boolean;
  onRestart?: () => void;
  onDownload?: () => void;
}

export default function VideoPreview({
  scenes,
  voiceVolume = 100,
  musicVolume = 30,
  musicTrackId,
  isRendering = false,
  onRestart,
  onDownload
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedProgressRef = useRef<number>(0);

  const currentScene = scenes && scenes.length > 0 ? scenes[currentSceneIndex] : null;

  useEffect(() => {
    if (!scenes || scenes.length === 0) return;
    const total = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    setTotalDuration(total);
  }, [scenes]);

  useEffect(() => {
    if (isPlaying && currentScene) {
      const sceneDuration = currentScene.duration * 1000;
      const startProgress = pausedProgressRef.current;
      const remainingDuration = sceneDuration * (1 - startProgress / 100);
      startTimeRef.current = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const additionalProgress = (elapsed / sceneDuration) * 100;
        const sceneProgress = Math.min(startProgress + additionalProgress, 100);
        setProgress(sceneProgress);

        if (elapsed >= remainingDuration) {
          if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex(currentSceneIndex + 1);
            setProgress(0);
            pausedProgressRef.current = 0;
          } else {
            setIsPlaying(false);
            setProgress(100);
            pausedProgressRef.current = 100;
          }
        }
      };

      timerRef.current = setInterval(updateProgress, 50);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else if (!isPlaying) {
      pausedProgressRef.current = progress;
    }
  }, [isPlaying, currentSceneIndex, currentScene, scenes.length]);

  const handlePlayPause = () => {
    if (!isPlaying && currentSceneIndex === scenes.length - 1 && progress === 100) {
      setCurrentSceneIndex(0);
      setProgress(0);
      pausedProgressRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setProgress(0);
    pausedProgressRef.current = 0;
    if (onRestart) {
      onRestart();
    }
  };

  const getCurrentTime = () => {
    let elapsed = 0;
    for (let i = 0; i < currentSceneIndex; i++) {
      elapsed += scenes[i].duration;
    }
    elapsed += (currentScene?.duration || 0) * (progress / 100);
    return elapsed;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      alert("Video yuklab olish funksiyasi hali qo'shilmagan. Bu funksiya server-side video rendering talab qiladi (FFmpeg).");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Video Ko'rinishi</h2>
        <p className="text-muted-foreground">
          Videongizni ko'ring va kerakli bo'lsa qayta boshlang
        </p>
      </div>

      <Card className="overflow-hidden" data-testid="card-video-preview">
        <CardContent className="p-0">
          <div className="relative bg-black aspect-[9/16] max-w-md mx-auto">
            {isRendering ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">Video tayyorlanmoqda...</p>
                  <p className="text-sm text-gray-400 mt-1">Bu 30-60 soniya davom etishi mumkin</p>
                </div>
              </div>
            ) : currentScene ? (
              <>
                <div className="absolute inset-0">
                  <img
                    src={currentScene.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(currentScene.text.slice(0, 30))}`}
                    alt={`Scene ${currentScene.id}`}
                    className="w-full h-full object-cover"
                    data-testid={`scene-image-${currentScene.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm font-medium" data-testid="scene-text">
                      {currentScene.text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Sahna {currentSceneIndex + 1}/{scenes.length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-white hover:bg-white/20"
                        onClick={handlePlayPause}
                        data-testid="button-play-pause"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-100"
                          style={{ width: totalDuration > 0 ? `${(getCurrentTime() / totalDuration) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-white text-sm" data-testid="time-display">
                        {formatTime(getCurrentTime())} / {formatTime(totalDuration)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-lg mb-2">Sahnalar topilmadi</p>
                  <p className="text-sm text-gray-400">Avval script va rasmlar yarating</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Video Spetsifikatsiyalari</p>
                <div className="flex gap-4 mt-2 flex-wrap">
                  <Badge variant="secondary">9:16 Nisbat</Badge>
                  <Badge variant="secondary">{scenes.length} Sahna</Badge>
                  <Badge variant="secondary">{totalDuration}s Davomiylik</Badge>
                  <Badge variant="secondary">Ovoz: {voiceVolume}%</Badge>
                  <Badge variant="secondary">Musiqa: {musicVolume}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleRestart}
            disabled={isRendering}
            data-testid="button-restart"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Qayta Boshlash
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={handleDownload}
            disabled={isRendering}
            data-testid="button-download"
          >
            <Download className="w-4 h-4 mr-2" />
            Videoni Yuklab Olish
          </Button>
        </div>

        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Eslatma:</strong> Bu video preview (ko'rinish). To'liq video fayl yuklab olish uchun server-side rendering (FFmpeg) qo'shilishi kerak. Hozircha faqat rasmlar animatsiyasi ko'rsatiladi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
