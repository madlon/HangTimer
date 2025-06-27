import React from 'react';
import type { TimerStatus, Phase } from '../hooks';

interface TimerDisplayProps {
  status: TimerStatus;
  totalSets: number;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  status,
  totalSets,
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
    if (state === 'completed') return 'phase-completed';
    if (state === 'paused') return 'phase-paused';
    return phase === 'hang' ? 'phase-hang' : 'phase-rest';
  };

  const getPhaseText = (phase: Phase, state: string): string => {
    if (state === 'completed') return 'Completed!';
    if (state === 'paused') return 'Paused';
    return phase === 'hang' ? 'HANG TIME' : 'REST TIME';
  };


  return (
    <div className="card" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Phase Indicator */}
      <div className={`phase-indicator ${getPhaseColor(status.phase, status.state)}`}>
        <h2 className="text-xl font-bold">
          {getPhaseText(status.phase, status.state)}
        </h2>
      </div>

      {/* Main Timer Display */}
      <div className="text-center mb-8">
        <div className={`timer-large ${getPhaseColor(status.phase, status.state)}`}>
          {formatTime(status.timeRemaining)}
        </div>
        {status.timeRemaining <= 10 && status.state === 'running' && (
          <div className="text-lg text-orange-600 font-semibold animate-pulse" style={{ marginTop: '8px' }}>
            {Math.ceil(status.timeRemaining)} seconds remaining
          </div>
        )}
      </div>

      {/* Progress Information */}
      <div className="mb-8 space-y-4">
        {/* Set Progress */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Set {status.currentSet} of {totalSets}
          </div>
          <div className="text-sm text-gray-600">
            Total time remaining: {formatTime(status.totalTimeRemaining)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
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
            className="w-full btn-primary text-xl"
            style={{ padding: '16px' }}
          >
            Start New Session
          </button>
        ) : (
          <>
            {status.state === 'running' ? (
              <button
                onClick={onPause}
                className="w-full btn-secondary text-xl"
                style={{ padding: '16px' }}
              >
                Pause
              </button>
            ) : (
              <button
                onClick={onResume}
                className="w-full btn-primary text-xl"
                style={{ padding: '16px' }}
              >
                {status.state === 'paused' ? 'Resume' : 'Start'}
              </button>
            )}
            
            <button
              onClick={onReset}
              className="w-full btn-secondary text-lg"
              style={{ padding: '12px' }}
            >
              Reset Session
            </button>
          </>
        )}
      </div>

      {/* Wake Lock Status */}
      <div style={{ marginTop: '16px' }} className="text-center text-xs text-gray-500">
        Screen will stay awake during workout
      </div>
    </div>
  );
};