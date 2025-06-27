# HangTimer - Architecture Decision Log

*Generated: 2025-06-26*

## Decision Log Format
Each decision follows: **Context → Options → Decision → Rationale → Consequences**

## ADR-001: Platform Choice
**Context:** Need to choose development platform for iOS-focused dead hang timer app
**Options Considered:**
- Option A: Native iOS (Swift/UIKit/SwiftUI) - Full iOS integration, best performance, iOS-only
- Option B: React Native - Cross-platform potential, web skills reuse, some iOS limitations
- Option C: Progressive Web App - Cross-platform, simple deployment, limited device APIs
**Decision:** Start with Progressive Web App, evaluate native iOS if needed
**Rationale:** 
- Faster development time for MVP
- Can leverage existing web development skills
- Modern web APIs support screen wake-lock and audio
- Easier to iterate and test across devices
- Can always port to native later if needed
**Consequences:** 
- May need to switch to native if audio mixing or screen wake-lock proves problematic
- App Store distribution requires native app eventually
- Some iOS-specific optimizations not available

## ADR-002: Audio Strategy
**Context:** Need audio cues that don't interrupt music/podcasts but are clearly audible
**Options Considered:**
- Option A: Web Audio API with careful volume management
- Option B: HTML5 Audio with ambient audio mixing
- Option C: Native iOS audio session management (requires native app)
**Decision:** HTML5 Audio with ambient mixing approach
**Rationale:**
- Web Audio API may be overkill for simple sound effects
- HTML5 Audio with proper settings can layer over other audio
- Simpler implementation for MVP
- Can upgrade to Web Audio API if more control needed
**Consequences:**
- May need to fine-tune audio levels for different environments
- Limited control over audio mixing compared to native
- Browser-dependent behavior possible

## ADR-003: Timer Architecture
**Context:** Need precise, reliable countdown timer that handles backgrounding
**Options Considered:**
- Option A: JavaScript setInterval with drift correction
- Option B: Web Workers with message passing
- Option C: RequestAnimationFrame with performance.now()
**Decision:** RequestAnimationFrame with performance.now() and setInterval backup
**Rationale:**
- Most accurate timing for display updates
- performance.now() provides high-resolution timestamps
- Handles browser tab switching gracefully
- Can combine with setInterval for backgrounded state
**Consequences:**
- Slightly more complex implementation
- Excellent accuracy and smooth display updates
- Good handling of browser background states

## ADR-004: State Management
**Context:** Need to manage session state, settings, and timer state
**Options Considered:**
- Option A: React Context + useReducer
- Option B: Simple useState hooks
- Option C: External state management library (Redux, Zustand)
**Decision:** React Context + useReducer for session state, localStorage for settings
**Rationale:**
- Appropriate complexity for app size
- Built-in React patterns, no external dependencies
- Clear separation of concerns
- localStorage persists user preferences
**Consequences:**
- All state management in React ecosystem
- No additional bundle size from state libraries
- Easy to understand and maintain

## ADR-005: UI Framework
**Context:** Need mobile-optimized UI components and styling
**Options Considered:**
- Option A: Custom CSS with CSS Modules
- Option B: Tailwind CSS for utility-first styling
- Option C: Material-UI or Chakra UI component library
**Decision:** Tailwind CSS with custom components
**Rationale:**
- Rapid prototyping and iteration
- Excellent mobile-first responsive design
- Small bundle size when properly configured
- Easy to create custom fitness app aesthetic
**Consequences:**
- Need to create custom components for specialized timer UI
- Excellent development speed and maintainability
- Full control over visual design

## Technology Stack Summary
**Frontend:** React with TypeScript
**Styling:** Tailwind CSS
**State Management:** React Context + useReducer
**Audio:** HTML5 Audio API
**Timer:** RequestAnimationFrame + performance.now()
**Storage:** localStorage for settings
**Deployment:** Netlify for web app hosting
**PWA Features:** Service Worker for offline capability (future)