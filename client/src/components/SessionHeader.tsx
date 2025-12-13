import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Download, Users } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ModeIndicator, type ConversationMode } from "./ModeIndicator";

interface SessionHeaderProps {
  sessionName?: string;
  activeModes: ConversationMode[];
  participantCount?: number;
  onSettingsClick: () => void;
  onExportClick: () => void;
  onModeToggle?: (mode: ConversationMode) => void;
}

export function SessionHeader({
  sessionName,
  activeModes,
  participantCount = 0,
  onSettingsClick,
  onExportClick,
  onModeToggle,
}: SessionHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b bg-card" data-testid="session-header">
      <div className="flex items-center gap-4 flex-wrap">
        {sessionName && (
          <h1 className="text-lg font-semibold" data-testid="text-session-name">
            {sessionName}
          </h1>
        )}
        <ModeIndicator modes={activeModes} onToggle={onModeToggle} />
        {participantCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span data-testid="text-participant-count">{participantCount} participants</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={onExportClick}
          data-testid="button-export"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onSettingsClick}
          data-testid="button-settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
