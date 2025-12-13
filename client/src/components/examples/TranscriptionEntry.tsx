import { TranscriptionEntry } from "../TranscriptionEntry";

export default function TranscriptionEntryExample() {
  return (
    <div className="space-y-1">
      <TranscriptionEntry
        entry={{
          id: "1",
          speaker: "Alice",
          text: "The Earth is approximately 4.5 billion years old.",
          timestamp: "00:15",
          factCheck: { status: "verified", sources: ["NASA", "Scientific American"] },
        }}
      />
      <TranscriptionEntry
        entry={{
          id: "2",
          speaker: "Bob",
          text: "Actually, I read somewhere that it might be younger than that.",
          timestamp: "00:28",
          factCheck: { status: "disputed" },
        }}
      />
      <TranscriptionEntry
        entry={{
          id: "3",
          speaker: "Alice",
          text: "Let me look that up...",
          timestamp: "00:35",
          isActive: true,
        }}
      />
    </div>
  );
}
