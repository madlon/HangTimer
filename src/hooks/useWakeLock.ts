import { useEffect, useRef, useState } from 'react';

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const retryIntervalRef = useRef<number | null>(null);
  const isRequestedRef = useRef<boolean>(false);

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
      // Always try to get a fresh wake lock
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch (e) {
          // Ignore release errors
        }
        wakeLockRef.current = null;
      }

      console.log('Requesting wake lock...');
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);
      isRequestedRef.current = true;

      // Listen for wake lock release
      wakeLockRef.current.addEventListener('release', () => {
        console.log('Wake lock was released');
        setIsActive(false);
        wakeLockRef.current = null;
      });

      console.log('✅ Screen wake lock activated successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to request screen wake lock:', error);
      setIsActive(false);
      wakeLockRef.current = null;
      return false;
    }
  };

  const releaseWakeLock = async (): Promise<void> => {
    console.log('Releasing wake lock...');
    isRequestedRef.current = false;
    
    // Clear retry interval
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsActive(false);
        console.log('✅ Screen wake lock released');
      } catch (error) {
        console.error('❌ Failed to release screen wake lock:', error);
      }
    }
  };

  // Aggressive wake lock maintenance
  useEffect(() => {
    if (!isRequestedRef.current || !isSupported) return;

    // Check and reacquire wake lock every 2 seconds
    retryIntervalRef.current = setInterval(async () => {
      if (isRequestedRef.current && !wakeLockRef.current && document.visibilityState === 'visible') {
        console.log('🔄 Wake lock lost, reacquiring...');
        await requestWakeLock();
      }
    }, 2000);

    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
  }, [isSupported]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isRequestedRef.current && !wakeLockRef.current) {
        console.log('📱 Document became visible, reacquiring wake lock');
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRequestedRef.current = false;
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
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