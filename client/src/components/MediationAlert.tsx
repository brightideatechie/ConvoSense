import { useState, useEffect } from "react";
import { X, AlertTriangle, Clock, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AlertType = "time-warning" | "interruption" | "floor-violation";

interface MediationAlertProps {
  type: AlertType;
  speaker: string;
  message: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const alertConfig: Record<AlertType, { icon: typeof AlertTriangle; bgClass: string }> = {
  "time-warning": { icon: Clock, bgClass: "bg-chart-4/10 border-chart-4" },
  interruption: { icon: AlertTriangle, bgClass: "bg-destructive/10 border-destructive" },
  "floor-violation": { icon: Hand, bgClass: "bg-chart-3/10 border-chart-3" },
};

export function MediationAlert({
  type,
  speaker,
  message,
  onDismiss,
  autoDismissMs = 5000,
}: MediationAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-md border ${config.bgClass} animate-in slide-in-from-top-2 duration-300`}
      data-testid={`mediation-alert-${type}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{speaker}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onDismiss}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface MediationAlertData {
  id: string;
  type: AlertType;
  speaker: string;
  message: string;
}

interface MediationAlertContainerProps {
  alerts: MediationAlertData[];
  onDismiss: (id: string) => void;
}

export function MediationAlertContainer({ alerts, onDismiss }: MediationAlertContainerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-80 space-y-2" data-testid="mediation-alerts-container">
      {alerts.map((alert) => (
        <MediationAlert
          key={alert.id}
          type={alert.type}
          speaker={alert.speaker}
          message={alert.message}
          onDismiss={() => onDismiss(alert.id)}
        />
      ))}
    </div>
  );
}
