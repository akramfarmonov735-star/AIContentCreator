import ScriptEditor from '../ScriptEditor';

export default function ScriptEditorExample() {
  const mockScript = [
    { id: 1, text: "Wake up at 5 AM and start your day with purpose. The early morning hours are when your mind is freshest." },
    { id: 2, text: "Hydrate immediately - drink a full glass of water to kickstart your metabolism." },
    { id: 3, text: "Exercise for 20 minutes. Even a quick workout releases endorphins and boosts energy." },
    { id: 4, text: "Plan your day with intention. Write down your top 3 priorities before checking your phone." }
  ];

  return (
    <ScriptEditor
      initialScript={mockScript}
      onRegenerateScene={(id) => console.log('Regenerate scene:', id)}
      onRegenerateAll={() => console.log('Regenerate all scenes')}
      onApprove={(script) => console.log('Approved script:', script)}
      isRegenerating={false}
    />
  );
}
