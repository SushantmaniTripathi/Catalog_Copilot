import { useEffect } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const { videoRef, isActive, error, startCamera, stopCamera, captureImage } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const image = captureImage();
    if (image) {
      stopCamera();
      onCapture(image);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
          <p className="text-destructive">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={startCamera}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 relative bg-foreground/5">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Capture button */}
      <div className="p-6 flex justify-center safe-area-inset-bottom">
        <button
          onClick={handleCapture}
          disabled={!isActive}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95"
        >
          <div className="w-16 h-16 rounded-full border-4 border-primary-foreground" />
        </button>
      </div>
    </div>
  );
}
