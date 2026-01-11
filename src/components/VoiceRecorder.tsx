import { Mic, MicOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface VoiceRecorderProps {
  imagePreview: string;
  onComplete: (audioBase64: string) => void;
  onBack: () => void;
}

export function VoiceRecorder({ imagePreview, onComplete, onBack }: VoiceRecorderProps) {
  const { isRecording, countdown, error, audioBase64, startRecording } = useAudioRecorder(6);

  const handleProceed = () => {
    if (audioBase64) {
      onComplete(audioBase64);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Image preview */}
      <div className="flex-1 relative bg-muted">
        <img
          src={`data:image/jpeg;base64,${imagePreview}`}
          alt="Product preview"
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Recording overlay */}
        {isRecording && (
          <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-destructive/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-destructive flex items-center justify-center animate-pulse">
                  <span className="text-4xl font-bold text-destructive-foreground">{countdown}</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-destructive animate-pulse-ring" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4 safe-area-inset-bottom">
        {error && (
          <p className="text-destructive text-center text-sm">{error}</p>
        )}
        
        <div className="text-center">
          {!audioBase64 && !isRecording && (
            <p className="text-muted-foreground text-sm mb-4">
              Describe your product in any language. Mention price, size, color, etc.
            </p>
          )}
          {isRecording && (
            <p className="text-destructive font-medium mb-4">
              Recording... Speak now!
            </p>
          )}
          {audioBase64 && !isRecording && (
            <p className="text-primary font-medium mb-4">
              <Check className="w-5 h-5 inline mr-1" />
              Voice recorded successfully!
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          
          {!audioBase64 ? (
            <Button 
              onClick={startRecording} 
              disabled={isRecording}
              className="flex-1"
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Recording...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleProceed} className="flex-1">
              Process Product
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
