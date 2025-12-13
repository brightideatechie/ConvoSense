import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  isActive: boolean;
  isPaused: boolean;
}

export function WaveformVisualizer({ isActive, isPaused }: WaveformVisualizerProps) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || isPaused || !barsRef.current) return;

    const bars = barsRef.current.children;
    const animationFrames: number[] = [];

    const animate = () => {
      Array.from(bars).forEach((bar) => {
        const height = Math.random() * 100;
        (bar as HTMLElement).style.height = `${Math.max(10, height)}%`;
      });
      animationFrames.push(requestAnimationFrame(animate));
    };

    const frameId = requestAnimationFrame(animate);
    animationFrames.push(frameId);

    return () => {
      animationFrames.forEach(cancelAnimationFrame);
    };
  }, [isActive, isPaused]);

  if (!isActive) return null;

  return (
    <div
      ref={barsRef}
      className="flex items-end justify-center gap-1 h-8"
      data-testid="waveform-visualizer"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-75 ${
            isPaused ? "bg-muted-foreground/30" : "bg-primary"
          }`}
          style={{ height: isPaused ? "20%" : "10%" }}
        />
      ))}
    </div>
  );
}
