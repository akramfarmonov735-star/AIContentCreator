import ImageManager from '../ImageManager';

export default function ImageManagerExample() {
  const mockScenes = [
    { 
      id: 1, 
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
      duration: 4.5,
      sceneText: "Wake up at 5 AM and start your day with purpose. The early morning hours are when your mind is freshest."
    },
    { 
      id: 2, 
      imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop",
      duration: 3.5,
      sceneText: "Hydrate immediately - drink a full glass of water to kickstart your metabolism."
    },
    { 
      id: 3, 
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      duration: 5.0,
      sceneText: "Exercise for 20 minutes. Even a quick workout releases endorphins and boosts energy."
    },
    { 
      id: 4, 
      imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
      duration: 4.0,
      sceneText: "Plan your day with intention. Write down your top 3 priorities before checking your phone."
    }
  ];

  return (
    <ImageManager
      scenes={mockScenes}
      onRegenerateImage={(id) => console.log('Regenerate image:', id)}
      onUploadImage={(id, file) => console.log('Upload image for scene:', id, file.name)}
      onDurationChange={(id, duration) => console.log('Duration changed:', id, duration)}
      onContinue={() => console.log('Continue to audio')}
      isGenerating={false}
    />
  );
}
