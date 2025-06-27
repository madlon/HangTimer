import { useRef, useCallback } from 'react';

export interface AudioCueConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
}

export const useAudio = (config: AudioCueConfig) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastIntervalCueRef = useRef<number>(0);
  const lastPhaseRef = useRef<string>('');

  // Initialize audio context on first use
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create a pleasant gong-like sound
  const playGong = useCallback(async (frequency: number = 432, duration: number = 0.5) => {
    if (!config.enabled) return;

    try {
      const audioContext = getAudioContext();
      
      // Resume audio context if it's suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();

      // Create a gong-like sound with frequency modulation
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioContext.currentTime + duration);

      // Add a low-pass filter for warmth
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
      filterNode.Q.setValueAtTime(1, audioContext.currentTime);

      // Envelope for natural decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.volume * 0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      // Connect the audio graph
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

    } catch (error) {
      console.warn('Failed to play audio cue:', error);
    }
  }, [config.enabled, config.volume, getAudioContext]);

  // Different sounds for different events
  const playIntervalCue = useCallback(() => {
    playGong(432, 0.3); // Higher, shorter sound for intervals
  }, [playGong]);

  const playWarningCue = useCallback(() => {
    playGong(324, 0.5); // Lower, longer sound for warnings
  }, [playGong]);

  const playPhaseChangeCue = useCallback(() => {
    // Double gong for phase changes
    playGong(432, 0.4);
    setTimeout(() => playGong(324, 0.4), 200);
  }, [playGong]);

  const playCompletionCue = useCallback(() => {
    // Triple ascending gong for completion
    playGong(324, 0.4);
    setTimeout(() => playGong(432, 0.4), 200);
    setTimeout(() => playGong(540, 0.6), 400);
  }, [playGong]);

  // Main function to handle timer audio cues
  const handleTimerUpdate = useCallback((
    timeRemaining: number,
    phase: 'hang' | 'rest',
    state: 'idle' | 'running' | 'paused' | 'completed'
  ) => {
    if (!config.enabled || state !== 'running') return;

    const currentInterval = Math.floor(timeRemaining);
    const phaseKey = `${phase}`;

    // Phase change detection
    if (lastPhaseRef.current !== '' && lastPhaseRef.current !== phaseKey) {
      playPhaseChangeCue();
    }
    lastPhaseRef.current = phaseKey;

    // 5 second warning
    if (timeRemaining <= 5 && timeRemaining > 4 && lastIntervalCueRef.current !== 5) {
      playWarningCue();
      lastIntervalCueRef.current = 5;
      return;
    }

    // 10 second intervals during hang phase
    if (phase === 'hang' && currentInterval > 5) {
      const intervalMark = Math.floor(currentInterval / 10) * 10;
      if (intervalMark > 0 && intervalMark !== lastIntervalCueRef.current && currentInterval === intervalMark) {
        playIntervalCue();
        lastIntervalCueRef.current = intervalMark;
      }
    }
  }, [config.enabled, playIntervalCue, playWarningCue, playPhaseChangeCue]);

  const handleSessionComplete = useCallback(() => {
    if (config.enabled) {
      playCompletionCue();
    }
  }, [config.enabled, playCompletionCue]);

  // Reset interval tracking when timer resets
  const reset = useCallback(() => {
    lastIntervalCueRef.current = 0;
    lastPhaseRef.current = '';
  }, []);

  return {
    handleTimerUpdate,
    handleSessionComplete,
    reset,
    playIntervalCue,
    playWarningCue,
    playPhaseChangeCue,
    playCompletionCue,
  };
};