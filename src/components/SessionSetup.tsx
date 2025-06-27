import React, { useState } from 'react';
import type { TimerConfig } from '../hooks/useTimer';

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Dead Hang Timer
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hang Duration */}
        <div>
          <label htmlFor="hangDuration" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600 w-16">
              {formatTime(config.hangDuration)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>15s</span>
            <span>2m</span>
          </div>
        </div>

        {/* Rest Duration */}
        <div>
          <label htmlFor="restDuration" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600 w-16">
              {formatTime(config.restDuration)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>30s</span>
            <span>5m</span>
          </div>
        </div>

        {/* Number of Sets */}
        <div>
          <label htmlFor="totalSets" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600 w-8">
              {config.totalSets}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* Session Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Session Summary</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div>Sets: {config.totalSets}</div>
            <div>Hang: {formatTime(config.hangDuration)} × {config.totalSets}</div>
            <div>Rest: {formatTime(config.restDuration)} × {config.totalSets - 1}</div>
            <div className="font-medium border-t border-blue-200 pt-2 mt-2">
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
          className="w-full btn-primary text-lg py-4"
        >
          Start Workout
        </button>
      </form>
    </div>
  );
};