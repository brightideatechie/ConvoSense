import { WaveformVisualizer } from "../WaveformVisualizer";

export default function WaveformVisualizerExample() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Active</p>
        <WaveformVisualizer isActive={true} isPaused={false} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Paused</p>
        <WaveformVisualizer isActive={true} isPaused={true} />
      </div>
    </div>
  );
}
