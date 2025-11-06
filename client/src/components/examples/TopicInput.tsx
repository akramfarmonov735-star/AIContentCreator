import TopicInput from '../TopicInput';

export default function TopicInputExample() {
  return (
    <TopicInput 
      onGenerate={(topic) => console.log('Generate script for:', topic)}
      isGenerating={false}
    />
  );
}
