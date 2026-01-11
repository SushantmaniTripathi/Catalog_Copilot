import { useState, useRef, useCallback, useEffect } from 'react';

export function useAudioRecorder(durationSeconds: number = 6) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(durationSeconds);
  const [error, setError] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBase64(null);
      chunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setAudioBase64(base64);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setCountdown(durationSeconds);

      // Start countdown
      let remaining = durationSeconds;
      timerRef.current = window.setInterval(() => {
        remaining--;
        setCountdown(remaining);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 1000);

    } catch (err) {
      console.error('Audio recording error:', err);
      setError('Could not access microphone. Please allow microphone permissions.');
    }
  }, [durationSeconds]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    countdown,
    error,
    audioBase64,
    startRecording,
    stopRecording
  };
}
