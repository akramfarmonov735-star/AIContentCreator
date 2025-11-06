import AudioControls from '../AudioControls';

export default function AudioControlsExample() {
  const mockMusicTracks = [
    { id: 'upbeat1', name: 'Uplifting Morning', category: 'Inspirational' },
    { id: 'chill1', name: 'Calm Focus', category: 'Ambient' },
    { id: 'energetic1', name: 'High Energy', category: 'Upbeat' },
    { id: 'minimal1', name: 'Minimal Piano', category: 'Classical' }
  ];

  return (
    <AudioControls
      voiceoverUrl="/mock-voiceover.mp3"
      onRegenerateVoice={() => console.log('Regenerate voiceover')}
      musicTracks={mockMusicTracks}
      selectedMusicId="upbeat1"
      onSelectMusic={(id) => console.log('Selected music:', id)}
      onVoiceVolumeChange={(vol) => console.log('Voice volume:', vol)}
      onMusicVolumeChange={(vol) => console.log('Music volume:', vol)}
      onContinue={() => console.log('Continue to video preview')}
      isGenerating={false}
    />
  );
}
