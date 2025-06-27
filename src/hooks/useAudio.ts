import { useRef, useCallback } from 'react';

export interface AudioCueConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
}

export const useAudio = (config: AudioCueConfig) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastIntervalCueRef = useRef<number>(0);
  const lastPhaseRef = useRef<string>('');
  const lastTimeRemainingRef = useRef<number>(0);

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
    console.log('🔔 Playing interval cue');
    playGong(432, 0.3); // Higher, shorter sound for intervals
  }, [playGong]);

  const playWarningCue = useCallback(() => {
    console.log('⚠️ Playing warning cue');
    playGong(324, 0.5); // Lower, longer sound for warnings
  }, [playGong]);

  const playPhaseChangeCue = useCallback(() => {
    console.log('🔄 Playing phase change cue');
    // Double gong for phase changes
    playGong(432, 0.4);
    setTimeout(() => playGong(324, 0.4), 200);
  }, [playGong]);

  const playCompletionCue = useCallback(() => {
    console.log('🎉 Playing completion cue');
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

    const currentSeconds = Math.floor(timeRemaining);
    const phaseKey = `${phase}`;
    const lastTime = lastTimeRemainingRef.current;

    // Phase change detection - reset interval tracking on phase change
    if (lastPhaseRef.current !== '' && lastPhaseRef.current !== phaseKey) {
      console.log(`🔄 Phase changed: ${lastPhaseRef.current} → ${phaseKey}`);
      playPhaseChangeCue();
      lastIntervalCueRef.current = 0; // Reset interval tracking for new phase
    }
    lastPhaseRef.current = phaseKey;

    // 5 second warning - only in hang phase
    if (phase === 'hang' && currentSeconds === 5 && lastTime > 5) {
      console.log('⚠️ 5 second warning triggered');
      playWarningCue();
      lastIntervalCueRef.current = 5;
      lastTimeRemainingRef.current = timeRemaining;
      return;
    }

    // 10 second intervals during hang phase only
    if (phase === 'hang' && currentSeconds > 5) {
      // Check for 10-second intervals (30, 20, 10 seconds remaining)
      if (currentSeconds % 10 === 0 && currentSeconds !== lastIntervalCueRef.current && lastTime > currentSeconds) {
        console.log(`🔔 10s interval cue at ${currentSeconds}s remaining`);
        playIntervalCue();
        lastIntervalCueRef.current = currentSeconds;
      }
    }

    lastTimeRemainingRef.current = timeRemaining;
  }, [config.enabled, playIntervalCue, playWarningCue, playPhaseChangeCue]);

  const handleSessionComplete = useCallback(() => {
    if (config.enabled) {
      console.log('🎉 Session completed');
      playCompletionCue();
    }
  }, [config.enabled, playCompletionCue]);

  // Reset interval tracking when timer resets
  const reset = useCallback(() => {
    console.log('🔄 Audio reset');
    lastIntervalCueRef.current = 0;
    lastPhaseRef.current = '';
    lastTimeRemainingRef.current = 0;
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