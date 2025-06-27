import React, { useState } from 'react';
import type { TimerConfig } from '../hooks';

interface SessionSetupProps {
  onStart: (config: TimerConfig) => void;
  defaultConfig: TimerConfig;
  audioEnabled: boolean;
  onAudioToggle: (enabled: boolean) => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onStart, defaultConfig, audioEnabled, onAudioToggle }) => {
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
        <div className="form-group text-center">
          <label className="form-label text-center">Hang Duration</label>
          <div className="flex items-center justify-center space-x-4" style={{ margin: '0 auto', maxWidth: '280px' }}>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, hangDuration: Math.max(5, prev.hangDuration - 5) }))}
              className="btn-secondary"
              style={{ width: '48px', height: '48px', fontSize: '24px', padding: '0' }}
            >
              −
            </button>
            <div 
              className="text-center font-semibold text-xl"
              style={{ 
                minWidth: '80px', 
                padding: '12px 16px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '8px',
                border: '2px solid #e5e7eb'
              }}
            >
              {formatTime(config.hangDuration)}
            </div>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, hangDuration: prev.hangDuration + 5 }))}
              className="btn-secondary"
              style={{ width: '48px', height: '48px', fontSize: '24px', padding: '0' }}
            >
              +
            </button>
          </div>
          <div className="text-center text-xs text-gray-500" style={{ marginTop: '4px' }}>
            5s steps
          </div>
        </div>

        {/* Rest Duration */}
        <div className="form-group text-center">
          <label className="form-label text-center">Rest Duration</label>
          <div className="flex items-center justify-center space-x-4" style={{ margin: '0 auto', maxWidth: '280px' }}>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, restDuration: Math.max(5, prev.restDuration - 5) }))}
              className="btn-secondary"
              style={{ width: '48px', height: '48px', fontSize: '24px', padding: '0' }}
            >
              −
            </button>
            <div 
              className="text-center font-semibold text-xl"
              style={{ 
                minWidth: '80px', 
                padding: '12px 16px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '8px',
                border: '2px solid #e5e7eb'
              }}
            >
              {formatTime(config.restDuration)}
            </div>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, restDuration: prev.restDuration + 5 }))}
              className="btn-secondary"
              style={{ width: '48px', height: '48px', fontSize: '24px', padding: '0' }}
            >
              +
            </button>
          </div>
          <div className="text-center text-xs text-gray-500" style={{ marginTop: '4px' }}>
            5s steps
          </div>
        </div>

        {/* Number of Sets */}
        <div className="form-group text-center">
          <label className="form-label text-center">Number of Sets</label>
          <div className="flex items-center justify-center space-x-4" style={{ margin: '0 auto', maxWidth: '280px' }}>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, totalSets: Math.max(1, prev.totalSets - 1) }))}
              className="btn-secondary"
              style={{ width: '48px', height: '48px', fontSize: '24px', padding: '0' }}
            >
              −
            </button>
            <div 
              className="text-center font-semibold text-xl"
              style={{ 
                minWidth: '80px', 
                padding: '12px 16px', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '8px',
                border: '2px solid #e5e7eb'
              }}
            >
              {config.totalSets}
            </div>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, totalSets: prev.totalSets + 1 }))}
              className="btn-secondary"
              style={{ width: '48px', height: '48px', fontSize: '24px', padding: '0' }}
            >
              +
            </button>
          </div>
          <div className="text-center text-xs text-gray-500" style={{ marginTop: '4px' }}>
            No limits
          </div>
        </div>

        {/* Audio Settings */}
        <div className="form-group">
          <label className="form-label text-center">Audio Cues</label>
          <div className="text-center" style={{ margin: '0 auto', maxWidth: '280px' }}>
            <div className="flex items-center justify-center space-x-3">
              <input
                type="checkbox"
                id="audioEnabled"
                checked={audioEnabled}
                onChange={(e) => onAudioToggle(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="audioEnabled" className="text-sm text-gray-700">
                Play audio cues during workout
              </label>
            </div>
            <div className="text-xs text-gray-500" style={{ marginTop: '4px' }}>
              (gongs every 10s, 5s warning, phase changes)
            </div>
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