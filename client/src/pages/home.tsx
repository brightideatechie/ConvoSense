import { useState, useEffect, useRef, useCallback } from "react";
import { SessionHeader } from "@/components/SessionHeader";
import { RecordingControls } from "@/components/RecordingControls";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { WaveformVisualizer } from "@/components/WaveformVisualizer";
import { SettingsDialog, type AppSettings } from "@/components/SettingsDialog";
import { ExportDialog } from "@/components/ExportDialog";
import { ConversationStats, type ParticipantStats } from "@/components/ConversationStats";
import type { TranscriptionEntryData } from "@/components/TranscriptionEntry";
import type { ConversationMode } from "@/components/ModeIndicator";
import type { FactCheckStatus } from "@/components/FactCheckBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockTranscriptEntries: TranscriptionEntryData[] = [
  {
    id: "demo-1",
    speaker: "Welcome",
    text: "Start a conversation to see the transcription appear here in real-time.",
    timestamp: "00:00",
  },
];

export default function HomePage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [entries, setEntries] = useState<TranscriptionEntryData[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");

  const [settings, setSettings] = useState<AppSettings>({
    factCheckEnabled: true,
    factFindingEnabled: false,
    mediationEnabled: false,
    mediationStrength: 0,
    openaiApiKey: "",
    anthropicApiKey: "",
    useLocalModel: true,
  });

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const entryIdRef = useRef(0);

  // Compute active modes from settings
  const activeModes: ConversationMode[] = [];
  if (settings.factCheckEnabled) activeModes.push("fact-check");
  if (settings.factFindingEnabled) activeModes.push("fact-finding");
  if (settings.mediationEnabled) activeModes.push("mediation");

  // Compute participant stats from entries
  const computeStats = useCallback((): ParticipantStats[] => {
    const speakerMap = new Map<string, { time: number; entries: number }>();

    entries.forEach((entry) => {
      const existing = speakerMap.get(entry.speaker) || { time: 0, entries: 0 };
      existing.time += 5; // Approximate 5 seconds per entry
      existing.entries += 1;
      speakerMap.set(entry.speaker, existing);
    });

    const totalTime = Array.from(speakerMap.values()).reduce((sum, s) => sum + s.time, 0) || 1;

    return Array.from(speakerMap.entries()).map(([name, data]) => ({
      name,
      speakingTime: data.time,
      speakingPercentage: (data.time / totalTime) * 100,
      interruptions: Math.floor(Math.random() * 3),
      factsChecked: Math.floor(Math.random() * 5),
      factsVerified: Math.floor(Math.random() * 5),
    }));
  }, [entries]);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Mock fact-check every 30 seconds
  useEffect(() => {
    if (!isRecording || !settings.factCheckEnabled) return;

    const factCheckInterval = setInterval(() => {
      setEntries((prev) => {
        if (prev.length === 0) return prev;
        const lastIndex = prev.length - 1;
        const lastEntry = prev[lastIndex];
        if (lastEntry.factCheck) return prev;

        const statuses: FactCheckStatus[] = ["verified", "disputed", "inconclusive"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        return [
          ...prev.slice(0, lastIndex),
          {
            ...lastEntry,
            factCheck: {
              status: randomStatus,
              sources: randomStatus === "verified" ? ["Verified Source"] : undefined,
            },
          },
        ];
      });
    }, 30000);

    return () => clearInterval(factCheckInterval);
  }, [isRecording, settings.factCheckEnabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Check for Web Speech API support
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();
          if (transcript) {
            entryIdRef.current += 1;
            const newEntry: TranscriptionEntryData = {
              id: `entry-${entryIdRef.current}`,
              speaker: `Speaker ${(entryIdRef.current % 3) + 1}`,
              text: transcript,
              timestamp: formatTime(elapsedTime),
            };
            setEntries((prev) => [...prev, newEntry]);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          toast({
            title: "Recognition Error",
            description: `Error: ${event.error}`,
            variant: "destructive",
          });
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setIsPaused(false);
      setElapsedTime(0);
      setEntries([]);

      toast({
        title: "Recording Started",
        description: "Speak clearly and the transcription will appear below.",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to start recording.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsPaused(false);

    toast({
      title: "Recording Stopped",
      description: `Conversation recorded. Duration: ${formatTime(elapsedTime)}`,
    });
  };

  const handlePauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsPaused(true);
  };

  const handleResumeRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    setIsPaused(false);
  };

  const handleUploadFile = (file: File) => {
    toast({
      title: "File Uploaded",
      description: `Processing ${file.name}... (Transcription from files coming in Phase 2)`,
    });
    // todo: implement file transcription
  };

  const handleExport = (options: any) => {
    toast({
      title: "Export Started",
      description: `Generating ${options.format.toUpperCase()} report...`,
    });
    console.log("Export options:", options);
    // todo: implement actual export
  };

  const handleModeToggle = (mode: ConversationMode) => {
    setSettings((prev) => {
      switch (mode) {
        case "fact-check":
          return { ...prev, factCheckEnabled: !prev.factCheckEnabled };
        case "fact-finding":
          return { ...prev, factFindingEnabled: !prev.factFindingEnabled };
        case "mediation":
          return { ...prev, mediationEnabled: !prev.mediationEnabled };
        default:
          return prev;
      }
    });
  };

  const displayEntries = entries.length > 0 ? entries : mockTranscriptEntries;

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="page-home">
      <SessionHeader
        sessionName={isRecording ? "Live Session" : undefined}
        activeModes={activeModes}
        participantCount={isRecording ? new Set(entries.map((e) => e.speaker)).size : 0}
        onSettingsClick={() => setSettingsOpen(true)}
        onExportClick={() => setExportOpen(true)}
        onModeToggle={handleModeToggle}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b bg-card">
          <div className="flex flex-col items-center gap-4">
            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              elapsedTime={elapsedTime}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onPauseRecording={handlePauseRecording}
              onResumeRecording={handleResumeRecording}
              onUploadFile={handleUploadFile}
            />
            <WaveformVisualizer isActive={isRecording} isPaused={isPaused} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList>
                <TabsTrigger value="transcript" data-testid="tab-transcript">
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="stats" data-testid="tab-stats">
                  Statistics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="transcript" className="flex-1 overflow-hidden mt-0">
              <TranscriptionPanel
                entries={displayEntries}
                onFactCheckClick={(id) => console.log("Fact check clicked:", id)}
              />
            </TabsContent>

            <TabsContent value="stats" className="flex-1 overflow-auto mt-0 p-6">
              {entries.length > 0 ? (
                <ConversationStats
                  participants={computeStats()}
                  totalDuration={elapsedTime}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>No statistics available yet</p>
                  <p className="text-sm">Start a conversation to see participant stats</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={setSettings}
      />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        onExport={handleExport}
      />
    </div>
  );
}
