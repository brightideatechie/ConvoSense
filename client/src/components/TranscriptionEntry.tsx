import { FactCheckBadge, type FactCheckStatus } from "./FactCheckBadge";

export interface TranscriptionEntryData {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  isActive?: boolean;
  factCheck?: {
    status: FactCheckStatus;
    sources?: string[];
  };
}

interface TranscriptionEntryProps {
  entry: TranscriptionEntryData;
  onFactCheckClick?: (id: string) => void;
}

const speakerColors = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
];

function getSpeakerColor(speaker: string): string {
  const hash = speaker.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return speakerColors[hash % speakerColors.length];
}

export function TranscriptionEntry({ entry, onFactCheckClick }: TranscriptionEntryProps) {
  const speakerColor = getSpeakerColor(entry.speaker);

  return (
    <div
      className={`flex gap-4 py-3 px-4 rounded-md transition-colors ${
        entry.isActive ? "bg-accent/50" : "hover-elevate"
      }`}
      data-testid={`transcription-entry-${entry.id}`}
    >
      <div className="flex-shrink-0 w-20">
        <span className={`text-sm font-medium ${speakerColor}`}>{entry.speaker}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base leading-relaxed">
          {entry.text}
          {entry.factCheck && (
            <span className="inline-block ml-2 align-middle">
              <FactCheckBadge
                status={entry.factCheck.status}
                sources={entry.factCheck.sources}
                onClick={() => onFactCheckClick?.(entry.id)}
              />
            </span>
          )}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className="font-mono text-xs text-muted-foreground" data-testid={`text-timestamp-${entry.id}`}>
          {entry.timestamp}
        </span>
      </div>
    </div>
  );
}
