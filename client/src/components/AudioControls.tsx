import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RefreshCw, Music, Mic, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MusicTrack {
  id: string;
  name: string;
  category: string;
}

interface AudioControlsProps {
  voiceoverUrl?: string;
  onRegenerateVoice?: () => void;
  musicTracks: MusicTrack[];
  selectedMusicId?: string;
  onSelectMusic?: (trackId: string) => void;
  onVoiceVolumeChange?: (volume: number) => void;
  onMusicVolumeChange?: (volume: number) => void;
  onContinue: () => void;
  isGenerating?: boolean;
}

export default function AudioControls({
  voiceoverUrl,
  onRegenerateVoice,
  musicTracks,
  selectedMusicId,
  onSelectMusic,
  onVoiceVolumeChange,
  onMusicVolumeChange,
  onContinue,
  isGenerating = false
}: AudioControlsProps) {
  const [voiceVolume, setVoiceVolume] = useState([100]);
  const [musicVolume, setMusicVolume] = useState([30]);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  const handleVoiceVolumeChange = (value: number[]) => {
    setVoiceVolume(value);
    onVoiceVolumeChange?.(value[0]);
  };

  const handleMusicVolumeChange = (value: number[]) => {
    setMusicVolume(value);
    onMusicVolumeChange?.(value[0]);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <Card data-testid="card-voiceover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            AI Voiceover
          </CardTitle>
          <CardDescription>
            AI-generated voice narrating your script. Regenerate or adjust volume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlayingVoice(!isPlayingVoice)}
              disabled={!voiceoverUrl}
              data-testid="button-play-voiceover"
            >
              {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
            <span className="text-sm text-muted-foreground">0:24 / 1:12</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume</label>
              <span className="text-sm text-muted-foreground">{voiceVolume[0]}%</span>
            </div>
            <Slider
              value={voiceVolume}
              onValueChange={handleVoiceVolumeChange}
              max={100}
              step={1}
              disabled={isGenerating}
              data-testid="slider-voice-volume"
            />
          </div>

          <Button
            variant="outline"
            onClick={onRegenerateVoice}
            disabled={isGenerating}
            data-testid="button-regenerate-voice"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Voiceover
          </Button>
        </CardContent>
      </Card>

      <Card data-testid="card-music">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Background Music
          </CardTitle>
          <CardDescription>
            Choose a background track to enhance your video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {musicTracks.map((track) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer ${
                  selectedMusicId === track.id ? 'border-primary bg-accent' : 'border-border'
                }`}
                onClick={() => onSelectMusic?.(track.id)}
                data-testid={`music-track-${track.id}`}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingMusicId(playingMusicId === track.id ? null : track.id);
                    }}
                    data-testid={`button-play-music-${track.id}`}
                  >
                    {playingMusicId === track.id ? 
                      <Pause className="w-4 h-4" /> : 
                      <Play className="w-4 h-4" />
                    }
                  </Button>
                  <div>
                    <p className="font-medium text-sm">{track.name}</p>
                    <p className="text-xs text-muted-foreground">{track.category}</p>
                  </div>
                </div>
                {selectedMusicId === track.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Music Volume</label>
              <span className="text-sm text-muted-foreground">{musicVolume[0]}%</span>
            </div>
            <Slider
              value={musicVolume}
              onValueChange={handleMusicVolumeChange}
              max={100}
              step={1}
              disabled={isGenerating}
              data-testid="slider-music-volume"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={onContinue}
              disabled={isGenerating}
              data-testid="button-continue-video"
            >
              Generate Video Preview
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
