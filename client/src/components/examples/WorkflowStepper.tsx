import WorkflowStepper from '../WorkflowStepper';

export default function WorkflowStepperExample() {
  const steps = [
    { id: 1, label: "Topic", description: "Enter idea" },
    { id: 2, label: "Script", description: "Review & edit" },
    { id: 3, label: "Images", description: "Customize scenes" },
    { id: 4, label: "Audio", description: "Voice & music" },
    { id: 5, label: "Video", description: "Preview & export" }
  ];

  return (
    <WorkflowStepper 
      steps={steps} 
      currentStep={2}
      onStepClick={(id) => console.log('Step clicked:', id)}
    />
  );
}
