import { SessionHeader } from "../SessionHeader";

export default function SessionHeaderExample() {
  return (
    <SessionHeader
      sessionName="Team Meeting - Dec 13"
      activeModes={["fact-check"]}
      participantCount={3}
      onSettingsClick={() => console.log("Settings clicked")}
      onExportClick={() => console.log("Export clicked")}
      onModeToggle={(mode) => console.log("Toggle mode:", mode)}
    />
  );
}
