import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, Clock } from "lucide-react";

export interface PanelResponse {
  modelName: string;
  modelType: "free" | "premium" | "user-api" | "local";
  response: string;
  confidence?: number;
  responseTime?: string;
  agrees?: boolean;
}

interface AIPanelResponseProps {
  question: string;
  responses: PanelResponse[];
  consensus?: string;
  hasDisagreement?: boolean;
}

const modelTypeBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  free: { label: "Free", variant: "secondary" },
  premium: { label: "Premium", variant: "default" },
  "user-api": { label: "Your API", variant: "outline" },
  local: { label: "Local", variant: "secondary" },
};

export function AIPanelResponse({
  question,
  responses,
  consensus,
  hasDisagreement,
}: AIPanelResponseProps) {
  return (
    <div className="space-y-4" data-testid="ai-panel-response">
      <div className="p-4 bg-muted rounded-md">
        <p className="text-sm font-medium text-muted-foreground">Question Asked:</p>
        <p className="text-base mt-1">{question}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {responses.map((resp, index) => {
          const typeConfig = modelTypeBadge[resp.modelType];
          return (
            <Card key={index} data-testid={`panel-response-${resp.modelName}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">{resp.modelName}</CardTitle>
                  <Badge variant={typeConfig.variant} className="text-xs">
                    {typeConfig.label}
                  </Badge>
                </div>
                {resp.responseTime && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {resp.responseTime}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{resp.response}</p>
                {resp.confidence !== undefined && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${resp.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{resp.confidence}%</span>
                  </div>
                )}
                {resp.agrees !== undefined && (
                  <div className="mt-2 flex items-center gap-1">
                    {resp.agrees ? (
                      <>
                        <Check className="h-4 w-4 text-chart-2" />
                        <span className="text-xs text-chart-2">Agrees with consensus</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-destructive" />
                        <span className="text-xs text-destructive">Disagrees</span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {consensus && (
        <Card className={hasDisagreement ? "border-chart-4" : "border-chart-2"}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {hasDisagreement ? (
                <AlertCircle className="h-5 w-5 text-chart-4" />
              ) : (
                <Check className="h-5 w-5 text-chart-2" />
              )}
              <CardTitle className="text-base">
                {hasDisagreement ? "Split Opinion" : "Consensus Reached"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{consensus}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
