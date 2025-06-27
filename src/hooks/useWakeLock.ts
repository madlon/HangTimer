import { useEffect, useRef, useState } from 'react';

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    // Check if Wake Lock API is supported
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Wake Lock API is not supported');
      return false;
    }

    try {
      if (wakeLockRef.current) {
        // Already have an active wake lock
        return true;
      }

      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);

      // Listen for wake lock release
      wakeLockRef.current.addEventListener('release', () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });

      console.log('Screen wake lock activated');
      return true;
    } catch (error) {
      console.error('Failed to request screen wake lock:', error);
      return false;
    }
  };

  const releaseWakeLock = async (): Promise<void> => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsActive(false);
        console.log('Screen wake lock released');
      } catch (error) {
        console.error('Failed to release screen wake lock:', error);
      }
    }
  };

  // Handle visibility change (reacquire wake lock when tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLockRef.current) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  };
};