import { ConversationStats, type ParticipantStats } from "../ConversationStats";

// todo: remove mock functionality
const mockParticipants: ParticipantStats[] = [
  {
    name: "Alice",
    speakingTime: 245,
    speakingPercentage: 45,
    interruptions: 1,
    factsChecked: 5,
    factsVerified: 4,
  },
  {
    name: "Bob",
    speakingTime: 180,
    speakingPercentage: 33,
    interruptions: 3,
    factsChecked: 3,
    factsVerified: 2,
  },
  {
    name: "Carol",
    speakingTime: 120,
    speakingPercentage: 22,
    interruptions: 0,
    factsChecked: 2,
    factsVerified: 2,
  },
];

export default function ConversationStatsExample() {
  return (
    <ConversationStats
      participants={mockParticipants}
      totalDuration={545}
    />
  );
}
