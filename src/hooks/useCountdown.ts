"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseCountdownOptions {
  durationSeconds: number;
  onComplete: () => void;
}

export function useCountdown({ durationSeconds, onComplete }: UseCountdownOptions) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  const start = useCallback(() => {
    setRemaining(durationSeconds);
    setRunning(true);
  }, [durationSeconds]);

  const cancel = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setRemaining(durationSeconds);
  }, [cancel, durationSeconds]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setTimeout(() => {
            setRunning(false);
            onCompleteRef.current();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  return { remaining, running, start, cancel, reset };
}
