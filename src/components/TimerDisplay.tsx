import React from 'react';
import type { TimerStatus, Phase } from '../hooks/useTimer';

interface TimerDisplayProps {
  status: TimerStatus;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  status,
  onPause,
  onResume,
  onReset,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = (phase: Phase, state: string): string => {
    if (state === 'completed') return 'text-green-600 bg-green-50';
    if (state === 'paused') return 'text-gray-600 bg-gray-50';
    return phase === 'hang' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50';
  };

  const getPhaseText = (phase: Phase, state: string): string => {
    if (state === 'completed') return 'Completed!';
    if (state === 'paused') return 'Paused';
    return phase === 'hang' ? 'HANG TIME' : 'REST TIME';
  };

  const getTimerSize = (): string => {
    // Larger text for main countdown
    return 'text-8xl md:text-9xl font-mono font-bold';
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg min-h-screen flex flex-col justify-center">
      {/* Phase Indicator */}
      <div className={`text-center mb-8 p-4 rounded-lg ${getPhaseColor(status.phase, status.state)}`}>
        <h2 className="text-xl font-bold">
          {getPhaseText(status.phase, status.state)}
        </h2>
      </div>

      {/* Main Timer Display */}
      <div className="text-center mb-8">
        <div className={`${getTimerSize()} leading-none ${getPhaseColor(status.phase, status.state)}`}>
          {formatTime(status.timeRemaining)}
        </div>
        {status.timeRemaining <= 10 && status.state === 'running' && (
          <div className="text-lg text-orange-600 font-semibold mt-2 animate-pulse">
            {Math.ceil(status.timeRemaining)} seconds remaining
          </div>
        )}
      </div>

      {/* Progress Information */}
      <div className="mb-8 space-y-4">
        {/* Set Progress */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Set {status.currentSet} of 5
          </div>
          <div className="text-sm text-gray-600">
            Total time remaining: {formatTime(status.totalTimeRemaining)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${status.progress * 100}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-600">
          {Math.round(status.progress * 100)}% complete
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        {status.state === 'completed' ? (
          <button
            onClick={onReset}
            className="w-full btn-primary text-xl py-4"
          >
            Start New Session
          </button>
        ) : (
          <>
            {status.state === 'running' ? (
              <button
                onClick={onPause}
                className="w-full btn-secondary text-xl py-4"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={onResume}
                className="w-full btn-primary text-xl py-4"
              >
                {status.state === 'paused' ? 'Resume' : 'Start'}
              </button>
            )}
            
            <button
              onClick={onReset}
              className="w-full btn-secondary text-lg py-3"
            >
              Reset Session
            </button>
          </>
        )}
      </div>

      {/* Wake Lock Status */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Screen will stay awake during workout
      </div>
    </div>
  );
};