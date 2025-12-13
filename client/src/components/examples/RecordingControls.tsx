import { useState, useEffect } from "react";
import { RecordingControls } from "../RecordingControls";

export default function RecordingControlsExample() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  return (
    <RecordingControls
      isRecording={isRecording}
      isPaused={isPaused}
      elapsedTime={elapsedTime}
      onStartRecording={() => {
        setIsRecording(true);
        setElapsedTime(0);
        console.log("Recording started");
      }}
      onStopRecording={() => {
        setIsRecording(false);
        setIsPaused(false);
        console.log("Recording stopped");
      }}
      onPauseRecording={() => {
        setIsPaused(true);
        console.log("Recording paused");
      }}
      onResumeRecording={() => {
        setIsPaused(false);
        console.log("Recording resumed");
      }}
      onUploadFile={(file) => {
        console.log("File uploaded:", file.name);
      }}
    />
  );
}
