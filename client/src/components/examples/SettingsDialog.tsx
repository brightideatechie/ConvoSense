import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SettingsDialog, type AppSettings } from "../SettingsDialog";

export default function SettingsDialogExample() {
  const [open, setOpen] = useState(true);
  const [settings, setSettings] = useState<AppSettings>({
    factCheckEnabled: true,
    factFindingEnabled: false,
    mediationEnabled: false,
    mediationStrength: 0,
    openaiApiKey: "",
    anthropicApiKey: "",
    useLocalModel: true,
  });

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          console.log("Settings saved:", newSettings);
        }}
      />
    </div>
  );
}
