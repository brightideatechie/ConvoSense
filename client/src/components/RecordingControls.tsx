import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Pause, Play, Upload } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onUploadFile: (file: File) => void;
  elapsedTime: number;
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function RecordingControls({
  isRecording,
  isPaused,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onUploadFile,
  elapsedTime,
}: RecordingControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!isRecording ? (
        <>
          <Button
            size="lg"
            onClick={onStartRecording}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
            data-testid="button-start-recording"
          >
            <Mic className="h-5 w-5" />
            Start Conversation
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
            data-testid="button-upload-file"
          >
            <Upload className="h-5 w-5" />
            Upload File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-file-upload"
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 bg-muted rounded-md px-4 py-2">
            <div className={`h-3 w-3 rounded-full ${isPaused ? "bg-yellow-500" : "bg-destructive animate-pulse"}`} />
            <span className="font-mono text-lg font-medium" data-testid="text-elapsed-time">
              {formatTime(elapsedTime)}
            </span>
          </div>
          {isPaused ? (
            <Button
              size="icon"
              variant="outline"
              onClick={onResumeRecording}
              data-testid="button-resume-recording"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="outline"
              onClick={onPauseRecording}
              data-testid="button-pause-recording"
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="destructive"
            onClick={onStopRecording}
            data-testid="button-stop-recording"
          >
            <Square className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
