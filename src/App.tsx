import { useState, useEffect } from 'react';
import { SessionSetup } from './components/SessionSetup';
import { TimerDisplay } from './components/TimerDisplay';
import { useTimer, type TimerConfig } from './hooks/useTimer';
import { useWakeLock } from './hooks/useWakeLock';

// Default configuration matching your typical workout
const DEFAULT_CONFIG: TimerConfig = {
  hangDuration: 30,  // 30 seconds
  restDuration: 60,  // 1 minute
  totalSets: 5,      // 5 sets
};

function App() {
  const [currentConfig, setCurrentConfig] = useState<TimerConfig>(DEFAULT_CONFIG);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const { status, start, pause, reset } = useTimer(currentConfig);
  const { isSupported: wakeLockSupported, isActive: wakeLockActive, requestWakeLock, releaseWakeLock } = useWakeLock();

  // Handle session start
  const handleStartSession = (config: TimerConfig) => {
    setCurrentConfig(config);
    setIsSessionActive(true);
    // Wake lock will be requested when timer starts
  };

  // Handle session reset/end
  const handleResetSession = () => {
    reset();
    setIsSessionActive(false);
    releaseWakeLock();
  };

  // Handle timer start (request wake lock)
  const handleTimerStart = () => {
    start();
    if (wakeLockSupported) {
      requestWakeLock();
    }
  };

  // Handle timer pause
  const handleTimerPause = () => {
    pause();
    // Keep wake lock active during pause in case user wants to resume quickly
  };

  // Release wake lock when session completes
  useEffect(() => {
    if (status.state === 'completed') {
      releaseWakeLock();
    }
  }, [status.state, releaseWakeLock]);

  // Cleanup wake lock on component unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        {!isSessionActive ? (
          <SessionSetup
            defaultConfig={DEFAULT_CONFIG}
            onStart={handleStartSession}
          />
        ) : (
          <TimerDisplay
            status={status}
            onPause={handleTimerPause}
            onResume={handleTimerStart}
            onReset={handleResetSession}
          />
        )}
        
        {/* Wake Lock Status (for debugging) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
            Wake Lock: {wakeLockSupported ? (wakeLockActive ? 'Active' : 'Inactive') : 'Not Supported'}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;