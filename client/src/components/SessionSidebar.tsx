import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, FileText, Trash2 } from "lucide-react";

export interface SessionRecord {
  id: string;
  name: string;
  date: string;
  duration: string;
  participantCount: number;
  isActive?: boolean;
}

interface SessionSidebarProps {
  sessions: SessionRecord[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: SessionSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r" data-testid="session-sidebar">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold mb-4">ConvoAI</h2>
        <Button onClick={onNewSession} className="w-full gap-2" data-testid="button-new-session">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent Sessions
          </p>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                activeSessionId === session.id
                  ? "bg-sidebar-accent"
                  : "hover-elevate"
              }`}
              onClick={() => onSelectSession(session.id)}
              data-testid={`session-item-${session.id}`}
            >
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{session.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.duration}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                data-testid={`button-delete-session-${session.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">Free Tier</Badge>
          <span>Local Model Active</span>
        </div>
      </div>
    </div>
  );
}
