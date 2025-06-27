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
  const pausedTimeRef = useRef<number>(0);

  // Calculate total session time
  const totalSessionTime = config.totalSets * (config.hangDuration + config.restDuration) - config.restDuration;

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = performance.now();
    const elapsed = (now - startTimeRef.current - pausedTimeRef.current) / 1000;
    
    // Calculate which phase and set we're in
    const singleSetDuration = config.hangDuration + config.restDuration;
    const totalElapsed = elapsed;
    const currentSetIndex = Math.floor(totalElapsed / singleSetDuration);
    const timeInCurrentSet = totalElapsed % singleSetDuration;
    
    const currentSet = Math.min(currentSetIndex + 1, config.totalSets);
    const isHangPhase = timeInCurrentSet < config.hangDuration;
    const phase: Phase = isHangPhase ? 'hang' : 'rest';
    
    let timeRemaining: number;
    if (isHangPhase) {
      timeRemaining = config.hangDuration - timeInCurrentSet;
    } else {
      timeRemaining = config.restDuration - (timeInCurrentSet - config.hangDuration);
    }
    
    const totalTimeRemaining = totalSessionTime - totalElapsed;
    const progress = Math.min(totalElapsed / totalSessionTime, 1);
    
    // Check if session is complete
    if (currentSet > config.totalSets || totalElapsed >= totalSessionTime) {
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
    if (status.state === 'idle') {
      startTimeRef.current = performance.now();
      pausedTimeRef.current = 0;
    } else if (status.state === 'paused') {
      const now = performance.now();
      pausedTimeRef.current += now - (startTimeRef.current || now);
      startTimeRef.current = now;
    }
    
    setStatus(prev => ({ ...prev, state: 'running' }));
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [status.state, updateTimer]);

  const pause = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setStatus(prev => ({ ...prev, state: 'paused' }));
  }, []);

  const reset = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startTimeRef.current = undefined;
    pausedTimeRef.current = 0;
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