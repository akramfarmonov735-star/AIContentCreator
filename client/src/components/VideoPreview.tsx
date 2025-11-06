import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, RefreshCw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoPreviewProps {
  videoUrl?: string;
  isRendering?: boolean;
  onRerender?: () => void;
  onDownload?: () => void;
}

export default function VideoPreview({
  videoUrl,
  isRendering = false,
  onRerender,
  onDownload
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Video is Ready!</h2>
        <p className="text-muted-foreground">
          Preview your video and download when ready for social media.
        </p>
      </div>

      <Card className="overflow-hidden" data-testid="card-video-preview">
        <CardContent className="p-0">
          <div className="relative bg-black aspect-[9/16] max-w-md mx-auto">
            {isRendering ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">Rendering your video...</p>
                  <p className="text-sm text-gray-400 mt-1">This may take 30-60 seconds</p>
                </div>
              </div>
            ) : videoUrl ? (
              <>
                <video
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=711&fit=crop"
                  data-testid="video-player"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-white hover:bg-white/20"
                        onClick={() => setIsPlaying(!isPlaying)}
                        data-testid="button-play-pause"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-white rounded-full" />
                      </div>
                      <span className="text-white text-sm">0:12 / 0:17</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-lg mb-2">No video preview available</p>
                  <p className="text-sm text-gray-400">Generate your video to see preview</p>
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
                <p className="font-medium">Video Specifications</p>
                <div className="flex gap-4 mt-2">
                  <Badge variant="secondary">9:16 Aspect Ratio</Badge>
                  <Badge variant="secondary">1080x1920px</Badge>
                  <Badge variant="secondary">MP4 Format</Badge>
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
            onClick={onRerender}
            disabled={isRendering}
            data-testid="button-rerender"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-render Preview
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={onDownload}
            disabled={isRendering || !videoUrl}
            data-testid="button-download"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Video
          </Button>
        </div>
      </div>
    </div>
  );
}
