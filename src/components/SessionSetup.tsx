import React, { useState } from 'react';
import type { TimerConfig } from '../hooks';

interface SessionSetupProps {
  onStart: (config: TimerConfig) => void;
  defaultConfig: TimerConfig;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onStart, defaultConfig }) => {
  const [config, setConfig] = useState<TimerConfig>(defaultConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(config);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Dead Hang Timer
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hang Duration */}
        <div className="form-group">
          <label htmlFor="hangDuration" className="form-label">
            Hang Duration
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="hangDuration"
              min="15"
              max="120"
              step="5"
              value={config.hangDuration}
              onChange={(e) => setConfig(prev => ({ ...prev, hangDuration: Number(e.target.value) }))}
              className="form-slider"
              style={{ flex: 1 }}
            />
            <span className="text-sm font-medium text-gray-600" style={{ width: '64px' }}>
              {formatTime(config.hangDuration)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500" style={{ marginTop: '4px' }}>
            <span>15s</span>
            <span>2m</span>
          </div>
        </div>

        {/* Rest Duration */}
        <div className="form-group">
          <label htmlFor="restDuration" className="form-label">
            Rest Duration
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="restDuration"
              min="30"
              max="300"
              step="15"
              value={config.restDuration}
              onChange={(e) => setConfig(prev => ({ ...prev, restDuration: Number(e.target.value) }))}
              className="form-slider"
              style={{ flex: 1 }}
            />
            <span className="text-sm font-medium text-gray-600" style={{ width: '64px' }}>
              {formatTime(config.restDuration)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500" style={{ marginTop: '4px' }}>
            <span>30s</span>
            <span>5m</span>
          </div>
        </div>

        {/* Number of Sets */}
        <div className="form-group">
          <label htmlFor="totalSets" className="form-label">
            Number of Sets
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="totalSets"
              min="1"
              max="20"
              step="1"
              value={config.totalSets}
              onChange={(e) => setConfig(prev => ({ ...prev, totalSets: Number(e.target.value) }))}
              className="form-slider"
              style={{ flex: 1 }}
            />
            <span className="text-sm font-medium text-gray-600" style={{ width: '32px' }}>
              {config.totalSets}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500" style={{ marginTop: '4px' }}>
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* Session Summary */}
        <div className="bg-blue-50" style={{ padding: '16px', borderRadius: '8px' }}>
          <h3 className="text-sm font-medium text-blue-800 mb-2">Session Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} className="text-sm text-blue-700">
            <div>Sets: {config.totalSets}</div>
            <div>Hang: {formatTime(config.hangDuration)} × {config.totalSets}</div>
            <div>Rest: {formatTime(config.restDuration)} × {config.totalSets - 1}</div>
            <div className="font-medium" style={{ borderTop: '1px solid #bfdbfe', paddingTop: '8px', marginTop: '8px' }}>
              Total Time: {formatTime(
                config.totalSets * config.hangDuration + 
                (config.totalSets - 1) * config.restDuration
              )}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full btn-primary text-lg"
          style={{ padding: '16px' }}
        >
          Start Workout
        </button>
      </form>
    </div>
  );
};