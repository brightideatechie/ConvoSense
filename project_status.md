# Project Status and Features Enumeration

## Introduction
The **AI-Driven Mediation and Real-Time Transcription** application is a collaborative platform designed to facilitate productive discussions and conflict resolution. By combining real-time speech-to-text transcription with advanced AI analysis, the app helps participants stay aligned, identifies factual discrepancies, and provides neutral mediation suggestions in real-time.

### Example Use Cases:
*   **Professional Mediation:** A neutral third party uses the tool to track claims and counterclaims during a dispute, with the AI highlighting points of agreement and suggesting compromise language.
*   **Team Brainstorming:** During a strategy session, the app transcribes ideas and summarizes the conversation flow, ensuring no voice is lost and the group stays on topic.
*   **Legal/Technical Interviews:** Conduct interviews where factual accuracy is paramount; the AI-driven fact-checking badge alerts users to potential inconsistencies with known data or previous statements.

---

## Feature Enumeration

| Feature | Status | Type | Description |
| :--- | :--- | :--- | :--- |
| **Real-Time Transcription UI** | **Mocked Up** | Frontend | A high-fidelity panel (`TranscriptionPanel.tsx`) that displays conversation entries with speaker identification. |
| **AI Mediation Alerts** | **Mocked Up** | Frontend | Visual indicators (`MediationAlert.tsx`) that pop up when the AI detects tension or provides a suggestion. |
| **Conversation Analytics** | **Mocked Up** | Frontend | Stats and summaries (`ConversationStats.tsx`, `ConversationSummary.tsx`) showing sentiment trends and key topics. |
| **Recording Controls** | **Mocked Up** | Frontend | UI components (`RecordingControls.tsx`) for starting, pausing, and stopping audio capture. |
| **Waveform Visualization** | **Mocked Up** | Frontend | A dynamic waveform (`WaveformVisualizer.tsx`) to provide visual feedback during audio recording. |
| **Fact-Checking Badges** | **Mocked Up** | Frontend | Small badges (`FactCheckBadge.tsx`) next to transcriptions to indicate verified or disputed information. |
| **Export Functionality** | **Mocked Up** | Frontend | A dialog (`ExportDialog.tsx`) allowing users to export transcripts and summaries in various formats. |
| **User Authentication** | **Partially Live** | Full Stack | Schema (`shared/schema.ts`) and storage (`server/storage.ts`) are set up for user management, but UI integration is minimal. |
| **Theme Management** | **Live** | Frontend | Support for Light and Dark modes with persistent settings. |

---

## Roadmap to "Live" Status

For the mocked-up features to become functional, the following steps are required:

1.  **Audio Integration:**
    *   Implement the **Web Audio API** in the frontend to capture actual microphone input.
    *   Connect the `RecordingControls` to the audio stream.

2.  **Transcription Engine:**
    *   Integrate a transcription service (e.g., **OpenAI Whisper API**) to process audio chunks.
    *   Set up a **WebSocket** or Server-Sent Events (SSE) connection between the frontend and backend for streaming text.

3.  **AI Analysis Layer:**
    *   Connect the transcript stream to the **Anthropic/OpenAI** integration on the backend.
    *   Implement prompts that analyze the text for mediation opportunities, sentiment, and factual accuracy.
    *   Push these AI insights back to the `AIPanelResponse` and `MediationAlert` components.

4.  **Data Persistence:**
    *   Update `server/storage.ts` and `server/routes.ts` to save conversation sessions, transcripts, and metadata to the database.
    *   Enable the `SessionSidebar` to fetch and display previous session history.

5.  **Analytics Implementation:**
    *   Process the stored transcription data to calculate real-time sentiment scores and keyword frequency for the `ConversationStats` component.
