import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface TopicInputProps {
  onGenerate: (topic: string) => void;
  isGenerating?: boolean;
}

export default function TopicInput({ onGenerate, isGenerating = false }: TopicInputProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = () => {
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Card data-testid="card-topic-input">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What video do you want to create?
          </CardTitle>
          <CardDescription>
            Describe your video idea, topic, or message. AI will generate a complete script with scenes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="E.g., 'A motivational video about morning routines for productivity' or 'Top 5 healthy breakfast ideas'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-32 resize-none"
            disabled={isGenerating}
            data-testid="input-topic"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {topic.length} characters
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!topic.trim() || isGenerating}
              size="lg"
              data-testid="button-generate-script"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Script
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
