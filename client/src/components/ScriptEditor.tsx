import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Scene {
  id: number;
  text: string;
}

interface ScriptEditorProps {
  initialScript: Scene[];
  onRegenerateScene?: (sceneId: number) => void;
  onRegenerateAll?: () => void;
  onApprove: (script: Scene[]) => void;
  isRegenerating?: boolean;
}

export default function ScriptEditor({ 
  initialScript, 
  onRegenerateScene, 
  onRegenerateAll,
  onApprove,
  isRegenerating = false 
}: ScriptEditorProps) {
  const [scenes, setScenes] = useState<Scene[]>(initialScript);

  const handleSceneChange = (sceneId: number, newText: string) => {
    setScenes(prev => prev.map(scene => 
      scene.id === sceneId ? { ...scene, text: newText } : scene
    ));
  };

  const totalWords = scenes.reduce((acc, scene) => 
    acc + scene.text.split(/\s+/).filter(Boolean).length, 0
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Card data-testid="card-script-editor">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Review & Edit Your Script
              </CardTitle>
              <CardDescription>
                Customize the AI-generated script. Edit scenes directly or regenerate individual scenes.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateAll}
              disabled={isRegenerating}
              data-testid="button-regenerate-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenes.map((scene) => (
            <div key={scene.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" data-testid={`badge-scene-${scene.id}`}>
                  Scene {scene.id}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerateScene?.(scene.id)}
                  disabled={isRegenerating}
                  data-testid={`button-regenerate-scene-${scene.id}`}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
              <Textarea
                value={scene.text}
                onChange={(e) => handleSceneChange(scene.id, e.target.value)}
                className="min-h-24 font-mono text-sm resize-vertical"
                disabled={isRegenerating}
                data-testid={`input-scene-${scene.id}`}
              />
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{scenes.length} scenes</span>
              <span>{totalWords} words</span>
              <span>~{Math.ceil(totalWords / 150)} min read</span>
            </div>
            <Button
              size="lg"
              onClick={() => onApprove(scenes)}
              disabled={isRegenerating}
              data-testid="button-approve-script"
            >
              Approve & Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
