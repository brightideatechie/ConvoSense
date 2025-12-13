import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FactCheckStatus = "verified" | "disputed" | "checking" | "inconclusive";

interface FactCheckBadgeProps {
  status: FactCheckStatus;
  sources?: string[];
  onClick?: () => void;
}

const statusConfig: Record<FactCheckStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Check }> = {
  verified: { label: "Verified", variant: "default", icon: Check },
  disputed: { label: "Disputed", variant: "destructive", icon: X },
  checking: { label: "Checking", variant: "secondary", icon: Loader2 },
  inconclusive: { label: "Inconclusive", variant: "outline", icon: AlertCircle },
};

export function FactCheckBadge({ status, sources, onClick }: FactCheckBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const badge = (
    <Badge
      variant={config.variant}
      className="cursor-pointer gap-1 text-xs"
      onClick={onClick}
      data-testid={`badge-fact-check-${status}`}
    >
      <Icon className={`h-3 w-3 ${status === "checking" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  );

  if (sources && sources.length > 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-medium">Sources:</p>
          <ul className="text-xs">
            {sources.map((source, i) => (
              <li key={i}>{source}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badge;
}
