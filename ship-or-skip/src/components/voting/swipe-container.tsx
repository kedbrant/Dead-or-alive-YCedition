"use client";

import { useRef, useState, useCallback, type ReactNode, type TouchEvent, type MouseEvent } from "react";
import { VoteType } from "./vote-buttons";

interface SwipeContainerProps {
  children: ReactNode;
  onSwipe: (direction: VoteType) => void;
  disabled?: boolean;
}

interface SwipeState {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

const SWIPE_THRESHOLD = 100; // Minimum distance to trigger a vote
const MAX_ROTATION = 15; // Maximum card tilt in degrees

export function SwipeContainer({ children, onSwipe, disabled = false }: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    currentX: 0,
    isDragging: false,
  });

  const deltaX = swipeState.currentX - swipeState.startX;
  const progress = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);
  const rotation = (deltaX / SWIPE_THRESHOLD) * MAX_ROTATION;
  const clampedRotation = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rotation));

  // Determine which direction we're swiping
  const swipeDirection: VoteType | null =
    Math.abs(deltaX) >= SWIPE_THRESHOLD
      ? deltaX > 0 ? "ship" : "skip"
      : null;

  const handleStart = useCallback((clientX: number) => {
    if (disabled) return;
    setSwipeState({
      startX: clientX,
      currentX: clientX,
      isDragging: true,
    });
  }, [disabled]);

  const handleMove = useCallback((clientX: number) => {
    if (disabled) return;
    setSwipeState(prev => {
      if (!prev.isDragging) return prev;
      return { ...prev, currentX: clientX };
    });
  }, [disabled]);

  const handleEnd = useCallback(() => {
    if (disabled) return;

    const finalDeltaX = swipeState.currentX - swipeState.startX;

    if (Math.abs(finalDeltaX) >= SWIPE_THRESHOLD) {
      // Trigger vote based on direction
      const direction: VoteType = finalDeltaX > 0 ? "ship" : "skip";
      onSwipe(direction);
    }

    // Reset state (with rubber band animation back to center if cancelled)
    setSwipeState({
      startX: 0,
      currentX: 0,
      isDragging: false,
    });
  }, [disabled, swipeState.startX, swipeState.currentX, onSwipe]);

  // Touch event handlers
  const onTouchStart = (e: TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Mouse event handlers (for desktop testing)
  const onMouseDown = (e: MouseEvent) => {
    handleStart(e.clientX);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!swipeState.isDragging) return;
    handleMove(e.clientX);
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    if (swipeState.isDragging) {
      handleEnd();
    }
  };

  // Calculate transform and transition styles
  const cardStyle: React.CSSProperties = {
    transform: swipeState.isDragging
      ? `translateX(${deltaX}px) rotate(${clampedRotation}deg)`
      : 'translateX(0) rotate(0deg)',
    transition: swipeState.isDragging
      ? 'none'
      : 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)', // Elastic easing for rubber band
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ touchAction: 'pan-y' }} // Allow vertical scroll, capture horizontal swipe
    >
      {/* Swipe indicator icons */}
      {swipeState.isDragging && (
        <>
          {/* Ship indicator (right swipe) */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl z-10 transition-opacity duration-150 pointer-events-none"
            style={{
              opacity: deltaX > 0 ? progress : 0,
            }}
          >
            <div
              className="w-16 h-16 rounded-full bg-ship/20 flex items-center justify-center border-2 border-ship"
              style={{
                transform: `scale(${0.5 + progress * 0.5})`,
                opacity: progress,
              }}
            >
              🚀
            </div>
          </div>

          {/* Skip indicator (left swipe) */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl z-10 transition-opacity duration-150 pointer-events-none"
            style={{
              opacity: deltaX < 0 ? progress : 0,
            }}
          >
            <div
              className="w-16 h-16 rounded-full bg-skip/20 flex items-center justify-center border-2 border-skip"
              style={{
                transform: `scale(${0.5 + progress * 0.5})`,
                opacity: progress,
              }}
            >
              💀
            </div>
          </div>
        </>
      )}

      {/* Card wrapper with transform */}
      <div
        style={cardStyle}
        className={`${disabled ? 'pointer-events-none' : 'cursor-grab'} ${swipeState.isDragging ? 'cursor-grabbing' : ''}`}
      >
        {children}
      </div>

      {/* Swipe threshold indicator (subtle glow when threshold is reached) */}
      {swipeState.isDragging && swipeDirection && (
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-150 ${
            swipeDirection === 'ship'
              ? 'shadow-[0_0_30px_rgba(34,197,94,0.4)]'
              : 'shadow-[0_0_30px_rgba(239,68,68,0.4)]'
          }`}
          style={{ opacity: progress }}
        />
      )}
    </div>
  );
}
