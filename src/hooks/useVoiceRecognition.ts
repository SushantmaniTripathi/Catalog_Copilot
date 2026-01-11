import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceRecognition(durationSeconds: number = 6) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(durationSeconds);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser. Try Chrome or Safari.');
    }
  }, []);

  const startRecording = useCallback(async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Will still recognize Hindi/other languages reasonably well
      
      let finalTranscript = '';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          // This is okay, just no speech detected
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setCountdown(durationSeconds);

      // Start countdown
      let remaining = durationSeconds;
      timerRef.current = window.setInterval(() => {
        remaining--;
        setCountdown(remaining);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          recognition.stop();
          setIsRecording(false);
        }
      }, 1000);

    } catch (err) {
      console.error('Voice recognition error:', err);
      setError('Could not start voice recognition. Please try again.');
    }
  }, [durationSeconds]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isRecording,
    countdown,
    error,
    transcript,
    isSupported,
    startRecording,
    stopRecording
  };
}
