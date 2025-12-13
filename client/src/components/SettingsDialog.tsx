import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export interface AppSettings {
  factCheckEnabled: boolean;
  factFindingEnabled: boolean;
  mediationEnabled: boolean;
  mediationStrength: number;
  openaiApiKey: string;
  anthropicApiKey: string;
  useLocalModel: boolean;
}

export function SettingsDialog({ open, onOpenChange, settings, onSave }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  const mediationLabels = ["Off", "Text Cue", "Soft Chime"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" data-testid="dialog-settings">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure AI models, conversation modes, and mediation rules
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="modes" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modes" data-testid="tab-modes">Modes</TabsTrigger>
            <TabsTrigger value="ai" data-testid="tab-ai">AI Models</TabsTrigger>
            <TabsTrigger value="mediation" data-testid="tab-mediation">Mediation</TabsTrigger>
          </TabsList>

          <TabsContent value="modes" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Conversation Modes</CardTitle>
                <CardDescription>Enable features during conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="fact-check" className="font-medium">Fact Check Mode</Label>
                    <p className="text-sm text-muted-foreground">Automatically verify statements</p>
                  </div>
                  <Switch
                    id="fact-check"
                    checked={localSettings.factCheckEnabled}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, factCheckEnabled: checked })
                    }
                    data-testid="switch-fact-check"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="fact-finding" className="font-medium">Fact Finding Mode</Label>
                    <p className="text-sm text-muted-foreground">Query AI panel for questions</p>
                  </div>
                  <Switch
                    id="fact-finding"
                    checked={localSettings.factFindingEnabled}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, factFindingEnabled: checked })
                    }
                    data-testid="switch-fact-finding"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="mediation" className="font-medium">Mediation Mode</Label>
                    <p className="text-sm text-muted-foreground">Enforce conversation rules</p>
                  </div>
                  <Switch
                    id="mediation"
                    checked={localSettings.mediationEnabled}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, mediationEnabled: checked })
                    }
                    data-testid="switch-mediation"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">AI Model Configuration</CardTitle>
                <CardDescription>Add your API keys or use local models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="local-model" className="font-medium">Use Local Model</Label>
                    <p className="text-sm text-muted-foreground">Run AI locally (free, slower)</p>
                  </div>
                  <Switch
                    id="local-model"
                    checked={localSettings.useLocalModel}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, useLocalModel: checked })
                    }
                    data-testid="switch-local-model"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="openai-key"
                      type={showOpenAI ? "text" : "password"}
                      placeholder="sk-..."
                      value={localSettings.openaiApiKey}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, openaiApiKey: e.target.value })
                      }
                      className="pr-10"
                      data-testid="input-openai-key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowOpenAI(!showOpenAI)}
                    >
                      {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <div className="relative">
                    <Input
                      id="anthropic-key"
                      type={showAnthropic ? "text" : "password"}
                      placeholder="sk-ant-..."
                      value={localSettings.anthropicApiKey}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, anthropicApiKey: e.target.value })
                      }
                      className="pr-10"
                      data-testid="input-anthropic-key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowAnthropic(!showAnthropic)}
                    >
                      {showAnthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mediation" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Mediation Settings</CardTitle>
                <CardDescription>Configure how the AI mediates conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="font-medium">Intervention Strength</Label>
                    <span className="text-sm font-medium text-muted-foreground">
                      {mediationLabels[localSettings.mediationStrength]}
                    </span>
                  </div>
                  <Slider
                    value={[localSettings.mediationStrength]}
                    onValueChange={([value]) =>
                      setLocalSettings({ ...localSettings, mediationStrength: value })
                    }
                    max={2}
                    step={1}
                    className="w-full"
                    data-testid="slider-mediation-strength"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Off</span>
                    <span>Text Cue</span>
                    <span>Soft Chime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-settings">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
