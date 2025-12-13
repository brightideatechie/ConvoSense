# Design Guidelines: AI Conversation Analysis & Mediation Platform

## Design Approach

**Selected Approach**: Reference-Based (Productivity Tools + Specialized Audio Applications)

**Primary References**: 
- Linear (clean productivity interface, command palette patterns)
- Otter.ai & Descript (transcription UI patterns)
- Notion (flexible workspace, clear mode switching)

**Key Design Principles**:
1. **Functional Clarity**: Every mode (recording, fact-checking, mediation) has distinct, unambiguous UI states
2. **Information Density with Breathing Room**: Dense data displays balanced with generous spacing
3. **Progressive Disclosure**: Complex settings hidden until needed, expert features accessible but not overwhelming
4. **Real-time Responsiveness**: Visual feedback for live transcription, AI processing, and mediation events

---

## Typography System

**Font Families**: 
- Primary: Inter (UI elements, transcription, statistics)
- Monospace: JetBrains Mono (timestamps, technical data)

**Hierarchy**:
- Page Titles: text-2xl font-semibold (Recording Session, Conversation Summary)
- Section Headers: text-lg font-medium (Transcription, Expert Panel, Statistics)
- Body Text: text-base font-normal (transcription content, participant names)
- Labels: text-sm font-medium (control labels, timestamps)
- Metadata: text-xs text-opacity-60 (speaker tags, confidence scores, timestamps)
- Monospace Data: text-sm font-mono (precise timing, technical stats)

---

## Layout System

**Spacing Primitives**: Tailwind units 2, 4, 6, 8, 12, 16
- Component internal padding: p-4 or p-6
- Section gaps: gap-6 or gap-8
- Page margins: p-8 or p-12 (desktop), p-4 (mobile)
- Card spacing: space-y-4 within cards

**Grid Structure**:
- Main workspace: Flexible multi-panel layout (sidebar + main + auxiliary panel when needed)
- Responsive breakpoints: Single column mobile (< 768px), multi-panel desktop (≥ 1024px)

---

## Core Component Library

### Navigation & Layout

**Main Navigation Sidebar** (left, collapsible):
- Session list/history
- Mode selector (Recording, Analysis, Settings)
- Active session indicator
- Quick actions (New Session, Upload File)
- Width: w-64 desktop, slide-over mobile

**Top Control Bar**:
- Recording controls (mic toggle, upload button, stop/pause)
- Active mode badges (Fact Check ON, Mediation ACTIVE)
- Session timer
- Settings icon (top-right)

### Recording & Transcription Interface

**Transcription Display Panel** (primary content area):
- Auto-scrolling transcript feed
- Speaker identification tags (left-aligned, text-sm font-medium)
- Timestamp markers (text-xs font-mono, right-aligned or inline)
- Fact-check indicators (inline badges for verified/disputed statements)
- Speaking participant highlighting (subtle background for active speaker)
- Line spacing: leading-relaxed for readability

**Audio Waveform Visualization** (optional, below controls):
- Real-time amplitude display during recording
- Visual speaking indicator

### Multi-LLM Expert Panel Interface

**Panel Comparison View** (appears in Fact-Finding mode):
- Grid layout: 2-3 columns for different LLM responses
- Each panel card includes:
  - Model name (text-sm font-semibold)
  - Response content (text-base)
  - Confidence indicator or response time
  - Agree/Disagree visual markers for consensus tracking
- Synthesis summary below grid (highlighted, larger text-base font-medium)

**LLM Configuration Panel** (settings):
- Checkbox list of available models
- API key input fields (with show/hide toggle)
- Model role tags (Free, Premium, User API)

### Fact-Checking Interface

**Inline Fact Indicators** (within transcription):
- Small badge next to checked statement
- Click to expand fact-check details
- Color-neutral until checked, then distinct states for verified/disputed

**Fact-Check Detail Card** (expandable):
- Original statement (quoted, text-sm italic)
- Verification sources (list with links)
- LLM consensus or disagreement note
- Timestamp of check

### Mediation & Rules Interface

**Mediation Control Panel** (slide-out or modal):
- Rule toggles (Turn-taking enforcement, Time limits, Interruption warnings)
- Intensity slider for intervention level (0-2 scale as Grok suggested)
- Active rule indicators (chips/badges)
- Conversation protocol presets (Formal Debate, Casual Discussion, Q&A)

**Real-time Mediation Alerts** (overlay/toast):
- Non-intrusive notification for speaking time warnings
- Visual cue for interruptions (subtle border flash on transcript)
- Gentle text prompts for rule violations

### Statistics & Evaluation Interface

**Participant Stats Cards** (grid layout, 2-4 columns):
- Speaking time (large number with progress bar)
- Interruption count
- Fact-check accuracy percentage
- Turn distribution graph (simple bar chart)

**Conversation Summary Panel**:
- Key topics discussed (tag cloud or list)
- Main points by participant (bulleted lists under names)
- Consensus areas vs. disagreements (two-column layout)
- Overall conversation quality score (if applicable)

### Settings & Configuration

**Settings Modal/Page**:
- Tabbed sections: Audio/Video, AI Models, Mediation Rules, Export
- Form inputs with clear labels (text-sm font-medium)
- Help text below inputs (text-xs opacity-60)
- Save/Cancel actions (sticky footer in modal)

**Audio Source Selection**:
- Radio buttons or dropdown for mic/camera selection
- Toggle for upload vs. live recording
- Recording quality presets

### Export & Sharing

**Export Dialog**:
- Format selection (PDF, JSON, Audio/Video)
- Content options (Transcript, Summary, Stats, All)
- Email recipient input (multi-select)
- Preview thumbnail for reports

---

## Responsive Behavior

**Desktop (≥1024px)**:
- Three-panel layout: Sidebar + Transcription + Auxiliary (stats/panel)
- Horizontal space for side-by-side LLM comparisons

**Tablet (768px-1023px)**:
- Two-panel: Collapsible sidebar + main content
- LLM panels stack vertically or 2-column

**Mobile (<768px)**:
- Single column, full-width
- Bottom navigation for mode switching
- Slide-up panels for settings/stats
- Recording controls fixed at bottom

---

## Special Interactions

**Live Transcription Animation**: Gentle fade-in for new transcript lines, auto-scroll with user override

**AI Processing Indicators**: Subtle pulse or shimmer on LLM panel cards while querying, spinner for fact-checks

**Mediation Interventions**: Soft visual cues (border glow, subtle overlay) rather than disruptive modals

---

## Images & Media

**Hero/Empty States**: 
- Microphone/waveform illustration for "No Active Session" state
- AI panel grid illustration for settings/onboarding
- Minimal, icon-based empty states rather than large hero images

**In-App Media**:
- Speaker avatar placeholders (circular, initials-based)
- LLM model icons (small, 24px)

This platform prioritizes functional clarity and information accessibility over visual flourish, ensuring users can focus on conversation content and AI insights without distraction.