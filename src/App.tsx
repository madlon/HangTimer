import { useState, useEffect, useRef } from 'react';
import { SessionSetup, TimerDisplay } from './components';
import { useTimer, useWakeLock, useAudio, type TimerConfig } from './hooks';

// Default configuration matching your typical workout
const DEFAULT_CONFIG: TimerConfig = {
  hangDuration: 30,  // 30 seconds
  restDuration: 60,  // 1 minute
  totalSets: 5,      // 5 sets
};

function App() {
  const [currentConfig, setCurrentConfig] = useState<TimerConfig>(DEFAULT_CONFIG);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const { status, start, pause, reset } = useTimer(currentConfig);
  const { isSupported: wakeLockSupported, isActive: wakeLockActive, requestWakeLock, releaseWakeLock } = useWakeLock();
  const audio = useAudio({ enabled: audioEnabled, volume: 0.7 });
  
  const prevStatusRef = useRef(status);

  // Handle session start
  const handleStartSession = (config: TimerConfig) => {
    setCurrentConfig(config);
    setIsSessionActive(true);
    // Wake lock will be requested when timer starts
  };

  // Handle session reset/end
  const handleResetSession = () => {
    reset();
    audio.reset();
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

  // Handle audio cues and session completion
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    
    // Handle audio cues during running state
    if (status.state === 'running') {
      audio.handleTimerUpdate(status.timeRemaining, status.phase, status.state);
    }
    
    // Handle session completion
    if (status.state === 'completed' && prevStatus.state !== 'completed') {
      audio.handleSessionComplete();
      releaseWakeLock();
    }
    
    prevStatusRef.current = status;
  }, [status, audio, releaseWakeLock]);

  // Cleanup wake lock on component unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return (
    <div style={{ minHeight: '100vh', padding: '16px 0' }}>
      <div className="container">
        {!isSessionActive ? (
          <SessionSetup
            defaultConfig={DEFAULT_CONFIG}
            audioEnabled={audioEnabled}
            onAudioToggle={setAudioEnabled}
            onStart={handleStartSession}
          />
        ) : (
          <TimerDisplay
            status={status}
            totalSets={currentConfig.totalSets}
            onPause={handleTimerPause}
            onResume={handleTimerStart}
            onReset={handleResetSession}
          />
        )}
        
        {/* Wake Lock Status (for debugging) */}
        {import.meta.env.DEV && (
          <div className="debug-info">
            Wake Lock: {wakeLockSupported ? (wakeLockActive ? 'Active' : 'Inactive') : 'Not Supported'}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;