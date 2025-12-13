import { ModeIndicator } from "../ModeIndicator";

export default function ModeIndicatorExample() {
  return (
    <ModeIndicator
      modes={["fact-check", "mediation"]}
      onToggle={(mode) => console.log("Toggle mode:", mode)}
    />
  );
}
