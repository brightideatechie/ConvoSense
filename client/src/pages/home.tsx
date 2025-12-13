import { useState, useEffect, useRef, useCallback } from "react";
import { SessionHeader } from "@/components/SessionHeader";
import { RecordingControls } from "@/components/RecordingControls";
import { TranscriptionPanel } from "@/components/TranscriptionPanel";
import { WaveformVisualizer } from "@/components/WaveformVisualizer";
import { SettingsDialog, type AppSettings } from "@/components/SettingsDialog";
import { ExportDialog } from "@/components/ExportDialog";
import { ConversationStats, type ParticipantStats } from "@/components/ConversationStats";
import { SessionSidebar, type SessionRecord } from "@/components/SessionSidebar";
import { AIPanelResponse, type PanelResponse } from "@/components/AIPanelResponse";
import { MediationAlertContainer, type AlertType } from "@/components/MediationAlert";
import { ConversationSummary } from "@/components/ConversationSummary";
import type { TranscriptionEntryData } from "@/components/TranscriptionEntry";
import type { ConversationMode } from "@/components/ModeIndicator";
import type { FactCheckStatus } from "@/components/FactCheckBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PanelLeftClose, PanelLeft } from "lucide-react";

// todo: remove mock functionality - comprehensive demo data
const mockSessions: SessionRecord[] = [
  { id: "1", name: "Team Standup - Dec 13", date: "Today", duration: "12:34", participantCount: 4 },
  { id: "2", name: "Client Call - Product Demo", date: "Yesterday", duration: "45:12", participantCount: 3 },
  { id: "3", name: "Budget Discussion Q1", date: "Dec 11", duration: "28:45", participantCount: 5 },
  { id: "4", name: "Design Review", date: "Dec 10", duration: "18:22", participantCount: 2 },
];

const mockTranscriptFull: TranscriptionEntryData[] = [
  {
    id: "1",
    speaker: "Alice",
    text: "Good morning everyone. Let's start by reviewing last week's progress on the AI integration.",
    timestamp: "00:05",
  },
  {
    id: "2",
    speaker: "Bob",
    text: "Sure. We completed the transcription module and it's now running at 95% accuracy.",
    timestamp: "00:18",
    factCheck: { status: "verified", sources: ["Internal Testing Report", "QA Dashboard"] },
  },
  {
    id: "3",
    speaker: "Carol",
    text: "That's great progress. What about the fact-checking feature? I heard it's using GPT-4 for verification.",
    timestamp: "00:32",
  },
  {
    id: "4",
    speaker: "Alice",
    text: "Actually, we're using a multi-model approach. The local coordinator queries both OpenAI and Anthropic, then synthesizes the results.",
    timestamp: "00:45",
    factCheck: { status: "verified" },
  },
  {
    id: "5",
    speaker: "David",
    text: "I think the response time might be too slow. Users expect answers in under 2 seconds.",
    timestamp: "01:02",
  },
  {
    id: "6",
    speaker: "Bob",
    text: "We've optimized that. Current average is 1.8 seconds for dual-model queries.",
    timestamp: "01:15",
    factCheck: { status: "checking" },
  },
  {
    id: "7",
    speaker: "Carol",
    text: "What about the mediation features? The speaking time enforcement seemed buggy last week.",
    timestamp: "01:28",
  },
  {
    id: "8",
    speaker: "Alice",
    text: "Fixed. The timer now correctly tracks per-speaker duration and issues warnings at configurable thresholds.",
    timestamp: "01:42",
    factCheck: { status: "verified" },
  },
  {
    id: "9",
    speaker: "David",
    text: "I still think we should add support for more debate formats. Parliamentary style would be useful.",
    timestamp: "01:55",
  },
  {
    id: "10",
    speaker: "Bob",
    text: "That's on the roadmap for phase 3. Right now we're focused on CX and LD formats.",
    timestamp: "02:08",
    factCheck: { status: "disputed", sources: ["Phase 2 includes parliamentary - see roadmap v2.1"] },
  },
  {
    id: "11",
    speaker: "Carol",
    text: "Let's move on to pricing. The $10/month tier seems competitive.",
    timestamp: "02:22",
  },
  {
    id: "12",
    speaker: "Alice",
    text: "Agreed. Free tier gets local model only, premium unlocks Claude and GPT-4 through our API keys.",
    timestamp: "02:35",
  },
];

const mockParticipants: ParticipantStats[] = [
  { name: "Alice", speakingTime: 185, speakingPercentage: 35, interruptions: 0, factsChecked: 4, factsVerified: 4 },
  { name: "Bob", speakingTime: 142, speakingPercentage: 27, interruptions: 1, factsChecked: 3, factsVerified: 2 },
  { name: "Carol", speakingTime: 118, speakingPercentage: 22, interruptions: 0, factsChecked: 1, factsVerified: 1 },
  { name: "David", speakingTime: 85, speakingPercentage: 16, interruptions: 2, factsChecked: 0, factsVerified: 0 },
];

const mockPanelResponses: PanelResponse[] = [
  {
    modelName: "GPT-4",
    modelType: "premium",
    response: "Based on current industry benchmarks, a response time of 1.8 seconds for dual-model queries is within acceptable range for real-time applications, though optimization to sub-1-second would improve user experience significantly.",
    confidence: 92,
    responseTime: "1.2s",
    agrees: true,
  },
  {
    modelName: "Claude 3",
    modelType: "premium",
    response: "The 1.8 second response time is reasonable for complex multi-model synthesis. However, for time-sensitive fact-checking during live debates, caching frequently verified claims could reduce latency to under 500ms for common queries.",
    confidence: 88,
    responseTime: "0.9s",
    agrees: true,
  },
  {
    modelName: "Local Llama",
    modelType: "local",
    response: "Response time metrics depend heavily on query complexity. Simple factual lookups average 0.8s while complex reasoning queries take 2.5s. The 1.8s average seems accurate for mixed workloads.",
    confidence: 75,
    responseTime: "0.4s",
    agrees: true,
  },
];

const mockSummary = {
  topics: [
    { name: "AI Integration", mentions: 8 },
    { name: "Performance", mentions: 5 },
    { name: "Fact-Checking", mentions: 4 },
    { name: "Pricing", mentions: 3 },
    { name: "Mediation", mentions: 3 },
  ],
  keyPoints: [
    { speaker: "Bob", point: "Transcription accuracy at 95%" },
    { speaker: "Alice", point: "Multi-model approach for verification" },
    { speaker: "David", point: "Concern about response time" },
    { speaker: "Carol", point: "$10/month tier is competitive" },
  ],
  consensusAreas: [
    "The transcription module is working well",
    "Multi-model approach is the right architecture",
    "Pricing structure is reasonable",
  ],
  disagreementAreas: [
    "Parliamentary debate format timeline",
    "Optimal response time threshold",
  ],
};

interface MediationAlertData {
  id: string;
  type: AlertType;
  speaker: string;
  message: string;
}

export default function HomePage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(155); // Start with demo time
  const [entries, setEntries] = useState<TranscriptionEntryData[]>(mockTranscriptFull);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState("1");
  const [mediationAlerts, setMediationAlerts] = useState<MediationAlertData[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const [settings, setSettings] = useState<AppSettings>({
    factCheckEnabled: true,
    factFindingEnabled: true,
    mediationEnabled: true,
    mediationStrength: 1,
    openaiApiKey: "",
    anthropicApiKey: "",
    useLocalModel: true,
  });

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const entryIdRef = useRef(mockTranscriptFull.length);

  const activeModes: ConversationMode[] = [];
  if (settings.factCheckEnabled) activeModes.push("fact-check");
  if (settings.factFindingEnabled) activeModes.push("fact-finding");
  if (settings.mediationEnabled) activeModes.push("mediation");

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Demo mediation alerts
  useEffect(() => {
    if (!isRecording || !settings.mediationEnabled) return;

    const alertInterval = setInterval(() => {
      const alertTypes: AlertType[] = ["time-warning", "interruption", "floor-violation"];
      const speakers = ["Alice", "Bob", "Carol", "David"];
      const messages: Record<AlertType, string> = {
        "time-warning": "has been speaking for over 2 minutes",
        "interruption": "interrupted the current speaker",
        "floor-violation": "spoke without having the floor",
      };

      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const speaker = speakers[Math.floor(Math.random() * speakers.length)];

      setMediationAlerts((prev) => [
        ...prev,
        { id: `alert-${Date.now()}`, type, speaker, message: messages[type] },
      ]);
    }, 15000);

    return () => clearInterval(alertInterval);
  }, [isRecording, settings.mediationEnabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
            const speakers = ["You", "Speaker 2", "Speaker 3"];
            const newEntry: TranscriptionEntryData = {
              id: `entry-${entryIdRef.current}`,
              speaker: speakers[entryIdRef.current % 3],
              text: transcript,
              timestamp: formatTime(elapsedTime),
            };
            setEntries((prev) => [...prev, newEntry]);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setIsPaused(false);

      toast({ title: "Recording Started", description: "Speak clearly - transcription is live." });
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
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setIsPaused(false);
    toast({ title: "Recording Stopped", description: `Duration: ${formatTime(elapsedTime)}` });
  };

  const handlePauseRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsPaused(true);
  };

  const handleResumeRecording = () => {
    if (recognitionRef.current) recognitionRef.current.start();
    setIsPaused(false);
  };

  const handleUploadFile = (file: File) => {
    toast({ title: "File Uploaded", description: `Processing ${file.name}...` });
  };

  const handleExport = (options: any) => {
    toast({ title: "Export Started", description: `Generating ${options.format.toUpperCase()} report...` });
  };

  const handleModeToggle = (mode: ConversationMode) => {
    setSettings((prev) => {
      switch (mode) {
        case "fact-check": return { ...prev, factCheckEnabled: !prev.factCheckEnabled };
        case "fact-finding": return { ...prev, factFindingEnabled: !prev.factFindingEnabled };
        case "mediation": return { ...prev, mediationEnabled: !prev.mediationEnabled };
        default: return prev;
      }
    });
  };

  const handleDismissAlert = (id: string) => {
    setMediationAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleNewSession = () => {
    setEntries([]);
    setElapsedTime(0);
    setActiveSessionId("");
    toast({ title: "New Session", description: "Ready to start a new conversation." });
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setEntries(mockTranscriptFull);
    setElapsedTime(155);
    toast({ title: "Session Loaded", description: `Loaded "${mockSessions.find((s) => s.id === id)?.name}"` });
  };

  const handleDeleteSession = (id: string) => {
    toast({ title: "Session Deleted", description: "Session removed from history." });
  };

  return (
    <div className="flex h-screen bg-background" data-testid="page-home">
      {sidebarOpen && (
        <div className="w-64 flex-shrink-0">
          <SessionSidebar
            sessions={mockSessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <SessionHeader
          sessionName={activeSessionId ? mockSessions.find((s) => s.id === activeSessionId)?.name : "New Session"}
          activeModes={activeModes}
          participantCount={4}
          onSettingsClick={() => setSettingsOpen(true)}
          onExportClick={() => setExportOpen(true)}
          onModeToggle={handleModeToggle}
        />

        <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-toggle-sidebar"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
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
          <div className="flex-1" />
          <WaveformVisualizer isActive={isRecording} isPaused={isPaused} />
          <Button
            variant={showAIPanel ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
            data-testid="button-toggle-ai-panel"
          >
            AI Panel
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-4 pt-3">
                <TabsList>
                  <TabsTrigger value="transcript" data-testid="tab-transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="summary" data-testid="tab-summary">Summary</TabsTrigger>
                  <TabsTrigger value="stats" data-testid="tab-stats">Statistics</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="transcript" className="flex-1 overflow-hidden mt-0">
                <TranscriptionPanel entries={entries} onFactCheckClick={(id) => console.log("Fact check:", id)} />
              </TabsContent>

              <TabsContent value="summary" className="flex-1 overflow-auto mt-0 p-6">
                <ConversationSummary
                  topics={mockSummary.topics}
                  keyPoints={mockSummary.keyPoints}
                  consensusAreas={mockSummary.consensusAreas}
                  disagreementAreas={mockSummary.disagreementAreas}
                  overallSentiment="positive"
                />
              </TabsContent>

              <TabsContent value="stats" className="flex-1 overflow-auto mt-0 p-6">
                <ConversationStats participants={mockParticipants} totalDuration={elapsedTime} />
              </TabsContent>
            </Tabs>
          </div>

          {showAIPanel && (
            <div className="w-[450px] border-l overflow-auto p-4 bg-card">
              <h3 className="text-lg font-semibold mb-4">Expert AI Panel Response</h3>
              <AIPanelResponse
                question="Is the 1.8 second response time acceptable for real-time fact-checking?"
                responses={mockPanelResponses}
                consensus="All models agree that 1.8 seconds is acceptable, with suggestions for caching to improve performance for common queries."
                hasDisagreement={false}
              />
            </div>
          )}
        </div>
      </div>

      <MediationAlertContainer alerts={mediationAlerts} onDismiss={handleDismissAlert} />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} settings={settings} onSave={setSettings} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} onExport={handleExport} />
    </div>
  );
}
