# HangTimer - Product Requirements Document

*Generated: 2025-06-26*

## Product Specification

### User Stories
**Epic 1: Session Management**
- As a user, I want to set hang duration (30s default) so that I can customize my workout intensity
- As a user, I want to set rest duration (1min default) so that I can control recovery time
- As a user, I want to set number of sets (5 default) so that I can plan my complete workout
- As a user, I want to easily modify these settings before each session so that I can adapt to my current fitness level

**Epic 2: Timer Experience**
- As a user, I want a large, clear countdown timer so that I can easily see remaining time while hanging
- As a user, I want the screen to stay awake during sessions so that I don't lose visibility
- As a user, I want to pause and resume the session so that I can handle interruptions
- As a user, I want to see current set number and remaining sets so that I know my progress

**Epic 3: Audio Feedback**
- As a user, I want audio cues every 10 seconds so that I can track progress without looking
- As a user, I want a 5-second warning so that I can prepare to release
- As a user, I want different sounds for hang vs rest periods so that I can distinguish phases
- As a user, I want audio to play over my music/podcasts so that I don't lose my entertainment
- As a user, I want to disable audio cues so that I can train silently when needed

### Functional Requirements
**Session Setup**
- REQ-001: App shall allow setting hang duration (15-120 seconds, default 30s)
- REQ-002: App shall allow setting rest duration (30-300 seconds, default 60s)
- REQ-003: App shall allow setting number of sets (1-20 sets, default 5)
- REQ-004: App shall save and allow editing of default values
- REQ-005: App shall provide easy parameter modification before each session

**Timer Functionality**
- REQ-006: App shall display countdown timer with large, readable font
- REQ-007: App shall maintain screen wake-lock during active sessions
- REQ-008: App shall track current set number and remaining sets
- REQ-009: App shall provide pause/resume functionality
- REQ-010: App shall clearly distinguish between hang phase and rest phase

**Audio System**
- REQ-011: App shall play audio cue every 10 seconds during hang phase
- REQ-012: App shall play distinct audio cue at 5 seconds remaining
- REQ-013: App shall provide rest period countdown audio
- REQ-014: App shall use non-interrupting audio that layers over other apps
- REQ-015: App shall provide toggle to disable all audio cues
- REQ-016: App shall use pleasant, yoga-style gong sounds

### Non-Functional Requirements
**Performance**
- Response time: Timer accuracy within 100ms
- Screen updates: Smooth countdown display at 60fps
- Audio latency: Audio cues within 50ms of timer events

**Usability**
- Portrait orientation optimized for one-handed operation
- Large touch targets (minimum 44pt on iOS)
- High contrast display for gym lighting conditions
- Simple, distraction-free interface during workouts

**Reliability**
- Timer must continue running when app is in foreground
- Audio cues must work consistently across iOS versions
- Screen wake-lock must persist for entire session duration

## Success Criteria
**Launch Criteria:**
- [ ] Completes 5-set workout session without interruption
- [ ] Audio cues play correctly over music/podcast apps
- [ ] Screen remains awake for entire session duration
- [ ] Pause/resume works reliably
- [ ] Timer accuracy verified within 100ms over 30-minute session

**Success Metrics:**
- **Daily Usage**: Regular use for dead hang training
- **Session Completion**: 95%+ of started sessions completed
- **Audio Reliability**: Audio cues work in 99%+ of sessions
- **User Satisfaction**: No frustration with screen timeout or audio interruptions