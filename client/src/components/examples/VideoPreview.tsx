import VideoPreview from '../VideoPreview';

export default function VideoPreviewExample() {
  return (
    <VideoPreview
      videoUrl="/mock-video.mp4"
      isRendering={false}
      onRerender={() => console.log('Re-render video')}
      onDownload={() => console.log('Download video')}
    />
  );
}
