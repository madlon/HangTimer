# HangTimer - Discovery Document

*Generated: 2025-06-26*

## Project Overview
**Problem Statement:** Current dead hang training using phone stopwatch is unreliable due to screen timeout, battery saving, lack of session tracking, and poor visibility while hanging.

**Vision:** A dedicated dead hang timer app that provides clear visual countdown, audio cues that work with music/podcasts, session tracking, and reliable screen-always-on functionality for consistent training.

**Success Metrics:** Consistent daily use, reliable audio cues, no accidental interruptions, clear visibility during workouts.

## Target Users
**Primary User:** Personal fitness enthusiast (you) doing dead hang shoulder training
**User Journey:** 
1. Open app and set session parameters (hang time, rest time, sets)
2. Position phone for visibility while hanging
3. Start session with clear countdown and audio cues
4. Complete 5 sets of 30-second hangs with 1-minute rest periods
5. Track progress through session with visual and audio feedback

**Key Value Moments:** 
- Clear countdown visibility during hang
- Audio cues that don't interrupt music/podcasts
- Knowing exactly how many sets remain
- Reliable pause/resume when needed

## Market Context
**Existing Solutions:** Generic timer apps, fitness apps with timers
**Competitive Advantage:** 
- Specialized for dead hang training
- Audio mixing that preserves background audio
- Screen always-on optimization
- Dead hang specific UI/UX design

**Market Timing:** Personal need-driven, immediate implementation priority

## Core Requirements
**Essential Features (MVP):**
1. Custom session setup (hang time: 30s, rest time: 1min, sets: 5)
2. Large, visible countdown timer with screen wake-lock
3. Audio cues every 10 seconds + 5-second warning (yoga-style gongs)
4. Session progress tracking (current set, sets remaining)
5. Pause/resume functionality
6. Settings to disable audio cues
7. Easy parameter editing before each session

**Future Features:**
- Customizable default settings for progression (45s hangs, etc.)
- Offline functionality
- Different sound themes
- Session history/statistics

**Technical Requirements:**
- Platform: iOS primary (with web app consideration)
- Orientation: Portrait mode
- Screen: Always-on during sessions
- Audio: Non-interrupting cues that layer over other audio
- Offline: Nice-to-have, not required for v1

## Risk Assessment
**Major Risks:**
1. **Audio mixing complexity** - Mitigation: Research iOS audio session management, test with common apps
2. **Screen timeout issues** - Mitigation: Implement proper wake-lock APIs, test on different iOS versions
3. **Accidental interruptions** - Mitigation: Simple, large UI elements, confirmation dialogs for critical actions

**Technical Challenges:**
- iOS audio session management for non-interrupting sounds
- Reliable screen wake-lock implementation
- Timer precision and reliability

## Next Steps
1. Research iOS audio session APIs and screen wake-lock
2. Create wireframe mockups for portrait timer interface
3. Set up React Native or Swift project structure