import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, MessageSquare, CheckCircle } from "lucide-react";

interface SummaryTopic {
  name: string;
  mentions: number;
}

interface KeyPoint {
  speaker: string;
  point: string;
}

interface ConversationSummaryProps {
  topics: SummaryTopic[];
  keyPoints: KeyPoint[];
  consensusAreas: string[];
  disagreementAreas: string[];
  overallSentiment: "positive" | "neutral" | "contentious";
}

export function ConversationSummary({
  topics,
  keyPoints,
  consensusAreas,
  disagreementAreas,
  overallSentiment,
}: ConversationSummaryProps) {
  const sentimentConfig = {
    positive: { label: "Constructive", color: "text-chart-2" },
    neutral: { label: "Neutral", color: "text-muted-foreground" },
    contentious: { label: "Contentious", color: "text-chart-4" },
  };

  const sentiment = sentimentConfig[overallSentiment];

  return (
    <div className="space-y-6" data-testid="conversation-summary">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold">Conversation Summary</h2>
        <Badge variant="outline" className={sentiment.color}>
          {sentiment.label} Discussion
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Topics Discussed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {topic.name}
                  <span className="text-xs opacity-60">({topic.mentions})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Key Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-medium text-chart-1">{point.speaker}:</span>
                  <span className="text-muted-foreground">{point.point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-chart-2">
              <CheckCircle className="h-4 w-4" />
              Areas of Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {consensusAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-chart-2 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-chart-4">
              <Users className="h-4 w-4" />
              Areas of Disagreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {disagreementAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-chart-4 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
