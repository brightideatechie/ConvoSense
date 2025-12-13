import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptionEntry, type TranscriptionEntryData } from "./TranscriptionEntry";
import { Mic } from "lucide-react";

interface TranscriptionPanelProps {
  entries: TranscriptionEntryData[];
  autoScroll?: boolean;
  onFactCheckClick?: (id: string) => void;
}

export function TranscriptionPanel({
  entries,
  autoScroll = true,
  onFactCheckClick,
}: TranscriptionPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, autoScroll]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 py-16">
        <div className="p-6 rounded-full bg-muted">
          <Mic className="h-12 w-12" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">No transcription yet</p>
          <p className="text-sm">Start a conversation or upload a recording to begin</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" data-testid="panel-transcription">
      <div className="space-y-1 p-4">
        {entries.map((entry) => (
          <TranscriptionEntry
            key={entry.id}
            entry={entry}
            onFactCheckClick={onFactCheckClick}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
