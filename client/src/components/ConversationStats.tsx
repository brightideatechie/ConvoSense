import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

export interface ParticipantStats {
  name: string;
  speakingTime: number;
  speakingPercentage: number;
  interruptions: number;
  factsChecked: number;
  factsVerified: number;
}

interface ConversationStatsProps {
  participants: ParticipantStats[];
  totalDuration: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function ConversationStats({ participants, totalDuration }: ConversationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="panel-conversation-stats">
      {participants.map((participant) => (
        <Card key={participant.name} data-testid={`card-stats-${participant.name}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{participant.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Speaking Time</span>
                </div>
                <span className="font-mono text-sm">{formatDuration(participant.speakingTime)}</span>
              </div>
              <Progress value={participant.speakingPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {participant.speakingPercentage.toFixed(1)}% of conversation
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="font-medium">{participant.interruptions}</p>
                  <p className="text-xs text-muted-foreground">Interruptions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="font-medium">
                    {participant.factsChecked > 0
                      ? `${Math.round((participant.factsVerified / participant.factsChecked) * 100)}%`
                      : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
