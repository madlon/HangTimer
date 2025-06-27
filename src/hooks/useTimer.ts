import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';
export type Phase = 'hang' | 'rest';

export interface TimerConfig {
  hangDuration: number; // in seconds
  restDuration: number; // in seconds
  totalSets: number;
}

export interface TimerStatus {
  state: TimerState;
  phase: Phase;
  currentSet: number;
  timeRemaining: number;
  totalTimeRemaining: number;
  progress: number; // 0-1
}

export const useTimer = (config: TimerConfig) => {
  const [status, setStatus] = useState<TimerStatus>({
    state: 'idle',
    phase: 'hang',
    currentSet: 1,
    timeRemaining: config.hangDuration,
    totalTimeRemaining: 0,
    progress: 0,
  });

  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const elapsedTimeRef = useRef<number>(0); // Track total elapsed time
  const lastUpdateRef = useRef<number | undefined>(undefined);

  // Calculate total session time
  const totalSessionTime = config.totalSets * (config.hangDuration + config.restDuration) - config.restDuration;

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current || !lastUpdateRef.current) return;

    const now = performance.now();
    const deltaTime = (now - lastUpdateRef.current) / 1000; // Convert to seconds
    lastUpdateRef.current = now;
    
    // Update elapsed time
    elapsedTimeRef.current += deltaTime;
    
    // Calculate which phase and set we're in
    const singleSetDuration = config.hangDuration + config.restDuration;
    const totalElapsed = elapsedTimeRef.current;
    const currentSetIndex = Math.floor(totalElapsed / singleSetDuration);
    const timeInCurrentSet = totalElapsed % singleSetDuration;
    
    const currentSet = Math.min(currentSetIndex + 1, config.totalSets);
    const isLastSet = currentSet === config.totalSets;
    
    // Determine phase
    let phase: Phase;
    let timeRemaining: number;
    
    if (isLastSet && timeInCurrentSet >= config.hangDuration) {
      // Session complete
      setStatus({
        state: 'completed',
        phase: 'hang',
        currentSet: config.totalSets,
        timeRemaining: 0,
        totalTimeRemaining: 0,
        progress: 1,
      });
      return;
    }
    
    if (timeInCurrentSet < config.hangDuration) {
      phase = 'hang';
      timeRemaining = config.hangDuration - timeInCurrentSet;
    } else {
      phase = 'rest';
      timeRemaining = config.restDuration - (timeInCurrentSet - config.hangDuration);
    }
    
    const totalTimeRemaining = totalSessionTime - totalElapsed;
    const progress = Math.min(totalElapsed / totalSessionTime, 1);
    
    setStatus({
      state: 'running',
      phase,
      currentSet,
      timeRemaining: Math.max(0, timeRemaining),
      totalTimeRemaining: Math.max(0, totalTimeRemaining),
      progress,
    });
    
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [config, totalSessionTime]);

  const start = useCallback(() => {
    const now = performance.now();
    startTimeRef.current = now;
    lastUpdateRef.current = now;
    
    setStatus(prev => ({ ...prev, state: 'running' }));
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [updateTimer]);

  const pause = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    startTimeRef.current = undefined;
    lastUpdateRef.current = undefined;
    setStatus(prev => ({ ...prev, state: 'paused' }));
  }, []);

  const reset = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    startTimeRef.current = undefined;
    lastUpdateRef.current = undefined;
    elapsedTimeRef.current = 0;
    
    setStatus({
      state: 'idle',
      phase: 'hang',
      currentSet: 1,
      timeRemaining: config.hangDuration,
      totalTimeRemaining: totalSessionTime,
      progress: 0,
    });
  }, [config.hangDuration, totalSessionTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update initial state when config changes
  useEffect(() => {
    if (status.state === 'idle') {
      setStatus({
        state: 'idle',
        phase: 'hang',
        currentSet: 1,
        timeRemaining: config.hangDuration,
        totalTimeRemaining: totalSessionTime,
        progress: 0,
      });
    }
  }, [config, status.state, totalSessionTime]);

  return {
    status,
    start,
    pause,
    reset,
  };
};