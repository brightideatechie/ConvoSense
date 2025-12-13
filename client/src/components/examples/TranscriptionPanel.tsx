import { TranscriptionPanel } from "../TranscriptionPanel";
import type { TranscriptionEntryData } from "../TranscriptionEntry";

// todo: remove mock functionality
const mockEntries: TranscriptionEntryData[] = [
  {
    id: "1",
    speaker: "Alice",
    text: "So, I've been thinking about the project timeline. We need to deliver the first phase by next Friday.",
    timestamp: "00:05",
  },
  {
    id: "2",
    speaker: "Bob",
    text: "That seems tight. What's included in the first phase again?",
    timestamp: "00:12",
  },
  {
    id: "3",
    speaker: "Alice",
    text: "The basic transcription functionality and the UI mockups. The fact-checking features come in phase two.",
    timestamp: "00:22",
    factCheck: { status: "verified" },
  },
  {
    id: "4",
    speaker: "Carol",
    text: "I think we can make that work if we prioritize correctly.",
    timestamp: "00:35",
  },
  {
    id: "5",
    speaker: "Bob",
    text: "The average person speaks about 150 words per minute.",
    timestamp: "00:48",
    factCheck: { status: "checking" },
  },
];

export default function TranscriptionPanelExample() {
  return (
    <div className="h-[400px] border rounded-md">
      <TranscriptionPanel
        entries={mockEntries}
        onFactCheckClick={(id) => console.log("Fact check clicked:", id)}
      />
    </div>
  );
}
