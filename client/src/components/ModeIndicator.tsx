import { Badge } from "@/components/ui/badge";
import { Check, Search, Shield } from "lucide-react";

export type ConversationMode = "fact-check" | "fact-finding" | "mediation";

interface ModeIndicatorProps {
  modes: ConversationMode[];
  onToggle?: (mode: ConversationMode) => void;
}

const modeConfig: Record<ConversationMode, { label: string; icon: typeof Check }> = {
  "fact-check": { label: "Fact Check", icon: Check },
  "fact-finding": { label: "Fact Finding", icon: Search },
  mediation: { label: "Mediation", icon: Shield },
};

export function ModeIndicator({ modes, onToggle }: ModeIndicatorProps) {
  if (modes.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {modes.map((mode) => {
        const config = modeConfig[mode];
        const Icon = config.icon;
        return (
          <Badge
            key={mode}
            variant="secondary"
            className="gap-1 cursor-pointer"
            onClick={() => onToggle?.(mode)}
            data-testid={`badge-mode-${mode}`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
            <span className="text-xs text-chart-2 ml-1">ON</span>
          </Badge>
        );
      })}
    </div>
  );
}
