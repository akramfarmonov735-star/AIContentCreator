import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Upload, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SceneImage {
  id: number;
  imageUrl: string;
  duration: number;
  sceneText: string;
}

interface ImageManagerProps {
  scenes: SceneImage[];
  onRegenerateImage?: (sceneId: number) => void;
  onUploadImage?: (sceneId: number, file: File) => void;
  onDurationChange?: (sceneId: number, duration: number) => void;
  onContinue: () => void;
  isGenerating?: boolean;
}

export default function ImageManager({
  scenes,
  onRegenerateImage,
  onUploadImage,
  onDurationChange,
  onContinue,
  isGenerating = false
}: ImageManagerProps) {
  const [durations, setDurations] = useState<Record<number, number>>(
    scenes.reduce((acc, scene) => ({ ...acc, [scene.id]: scene.duration }), {})
  );

  const handleDurationChange = (sceneId: number, value: number) => {
    const newDuration = Math.max(1, Math.min(10, value));
    setDurations(prev => ({ ...prev, [sceneId]: newDuration }));
    onDurationChange?.(sceneId, newDuration);
  };

  const totalDuration = Object.values(durations).reduce((sum, d) => sum + d, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
          <ImageIcon className="w-6 h-6 text-primary" />
          Customize Scene Images
        </h2>
        <p className="text-muted-foreground">
          Review AI-generated images for each scene. Regenerate or upload your own images.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {scenes.map((scene) => (
          <Card key={scene.id} className="overflow-hidden" data-testid={`card-scene-${scene.id}`}>
            <div className="relative aspect-video bg-muted">
              <img
                src={scene.imageUrl}
                alt={`Scene ${scene.id}`}
                className="w-full h-full object-cover"
                data-testid={`img-scene-${scene.id}`}
              />
              <div className="absolute top-2 left-2">
                <Badge data-testid={`badge-scene-${scene.id}`}>Scene {scene.id}</Badge>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {scene.sceneText}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium flex-shrink-0">Duration:</label>
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDurationChange(scene.id, durations[scene.id] - 0.5)}
                    disabled={isGenerating}
                    data-testid={`button-decrease-duration-${scene.id}`}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={durations[scene.id]}
                    onChange={(e) => handleDurationChange(scene.id, parseFloat(e.target.value))}
                    className="h-8 w-20 text-center"
                    disabled={isGenerating}
                    data-testid={`input-duration-${scene.id}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDurationChange(scene.id, durations[scene.id] + 0.5)}
                    disabled={isGenerating}
                    data-testid={`button-increase-duration-${scene.id}`}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">sec</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onRegenerateImage?.(scene.id)}
                  disabled={isGenerating}
                  data-testid={`button-regenerate-${scene.id}`}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) onUploadImage?.(scene.id, file);
                    };
                    input.click();
                  }}
                  disabled={isGenerating}
                  data-testid={`button-upload-${scene.id}`}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total video duration: <span className="font-medium text-foreground">{totalDuration.toFixed(1)}s</span>
            </div>
            <Button
              size="lg"
              onClick={onContinue}
              disabled={isGenerating}
              data-testid="button-continue-audio"
            >
              Continue to Audio
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
