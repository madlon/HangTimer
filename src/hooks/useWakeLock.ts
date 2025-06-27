import { useEffect, useRef, useState } from 'react';

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

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
        console.log('Wake lock was released');
        setIsActive(false);
        wakeLockRef.current = null;
        
        // Auto-retry after a short delay if the document is still visible
        if (document.visibilityState === 'visible') {
          retryTimeoutRef.current = setTimeout(() => {
            requestWakeLock();
          }, 100);
        }
      });

      console.log('Screen wake lock activated');
      return true;
    } catch (error) {
      console.error('Failed to request screen wake lock:', error);
      setIsActive(false);
      wakeLockRef.current = null;
      return false;
    }
  };

  const releaseWakeLock = async (): Promise<void> => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

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
        console.log('Document became visible, reacquiring wake lock');
        await requestWakeLock();
      } else if (document.visibilityState === 'hidden') {
        console.log('Document became hidden');
        // Don't release wake lock when hidden - let it handle itself
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isSupported]);

  // Periodically check and reacquire wake lock if needed
  useEffect(() => {
    if (!isActive || !isSupported) return;

    const checkInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        console.log('Wake lock check: reacquiring lost wake lock');
        requestWakeLock();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [isActive, isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
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