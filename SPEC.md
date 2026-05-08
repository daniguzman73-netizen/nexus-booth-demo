# Nexus Extend "Spot the Issues" Booth Demo
## Build Specification for ALA 2026

---

## 1. Project Overview

**Purpose:** Interactive booth demo at ALA 2026 to showcase Nexus Extend (Clarivate's browser extension that connects users in AI tools to trusted library resources).

**Format:** Touchscreen kiosk, 1-2 stations. Target interaction: 2-3 minutes per visitor. Throughput: ~20-25 visitors/hour/station.

**Core experience:** Visitor identifies issues in AI-generated citations under a time limit, then watches Nexus instantly do the same job. Score added to a conference-wide leaderboard.

---

## 2. User Flow

```
[1] Welcome screen
      ↓ tap to start
[2] Institution selection (typeahead search)
      ↓
[3] Discipline selection (6 tiles)
      ↓
[4] Scenario intro (1 screen, ~5 sec)
      ↓
[5] The Challenge: 60-sec timer, 5 citations to flag
      ↓ time up OR submit
[6] Results reveal: user score
      ↓
[7] Nexus reveal: extension "scans" the same page in 2 sec
      ↓
[8] Guided tour: 3 click-throughs (full text, alternatives, library services)
      ↓
[9] Leaderboard entry: name (required) + email (optional) + opt-in checkbox
      ↓
[10] Final screen: leaderboard position + QR code for take-home summary
      ↓ auto-reset after 15 sec
```

---

## 3. Screen-by-Screen Spec

### Screen 1: Welcome
- Big headline: **"Spot the Issues"**
- Subhead: *"Can you catch what AI gets wrong? Beat the leaderboard."*
- Prominent "TAP TO START" button
- Live ticker at bottom: "Today's top scorer: [Name] from [Institution] — [Score]"
- Background: subtle animation, Clarivate/Nexus branding

### Screen 2: Institution Selection
- Prompt: *"Which library are you from?"*
- Typeahead search box (start typing, autocomplete from a JSON list of ~3,000 US/Canadian academic libraries)
- "I'm not from a library" → defaults to generic "Academic Library Companion" branding
- Skip button: "Skip — use generic branding"

### Screen 3: Discipline Selection
- Prompt: *"Pick a discipline"*
- 6 tiles in a grid:
  - 🧬 Life Sciences
  - 🧠 Psychology
  - 📚 Humanities
  - 💼 Business / Economics
  - ⚖️ Law / Policy
  - 🌍 Environmental Science
- Each tile shows the discipline name + a sample research question that will be used

### Screen 4: Scenario Intro (5-second display, auto-advance)
- Frame: *"A student asked an AI chatbot:"*
- Shows the research question for the selected discipline
- *"It returned 5 citations. You have 60 seconds to flag the ones with issues."*
- "READY?" button or auto-advances after 5 sec

### Screen 5: The Challenge

**Flagging mechanic:** Simple binary flag. The player taps next to each citation they suspect has an issue. No categorization during play — that comes on the results screen. Goal: keep the live game fast and low-friction so anyone can play.

**Layout:**
- Left 60%: mock ChatGPT/Claude interface showing the AI response with 5 inline citations [1] [2] [3] [4] [5]
- Right 40%: 5 citation cards stacked vertically, each with a clearly visible flag control
- Top: countdown timer (60 → 0), counter "Flagged: X of 5"
- Bottom: "SUBMIT" button (always available, prominent)

**Citation card design (critical — must be visually obvious):**

Each card has three zones:
1. **Left edge — large flag button (the primary affordance):** A big tappable area with a flag icon (🚩) and the label "TAP TO FLAG". Minimum 80×80px target. Pulses gently with a subtle animation when the screen first loads to draw attention. Stops pulsing after the first tap anywhere on screen.
2. **Center — citation text:** Author, title, journal, year. Readable at arm's length on a touchscreen.
3. **Right edge — citation number badge:** Large [1], [2], etc. matches the inline marker in the chat on the left.

**States:**
- *Default:* white card, gray flag button labeled "TAP TO FLAG"
- *Flagged:* yellow border on entire card, flag button turns yellow with the label "🚩 FLAGGED — TAP TO UNDO", and a flag icon appears next to the citation number on the chat side
- *Hover/active:* slight scale-up (1.02x) on touch for tactile feedback

**Above the citation list, a one-line instruction strip:**
> *"👇 Tap the flag next to any citation that looks suspicious"*

This strip remains visible throughout the round (doesn't disappear after first interaction) — visitors arriving mid-conversation with friends still need the cue.

**Pre-game micro-tutorial (3 seconds, on Screen 4):**
After the scenario intro text, show an animated GIF or CSS animation of a finger tapping a flag button on a sample card, with the card turning yellow. This silently teaches the mechanic before the timer starts.

**Interaction:**
- Tap flag area → card flagged, counter increments
- Tap again → unflagged
- Whole card is *not* the tap target — only the flag zone — to avoid accidental flags when reading
- Submit button or timeout ends the round
- During play, no feedback on whether flags are correct

### Screen 6: Results Reveal

This screen reveals the truth about each citation **with explicit category labels** — this teaches the taxonomy of AI failures and primes the visitor for the Nexus reveal that follows (which uses the same labels).

Show each of the 5 citations with the truth revealed and a clear category label:
- ✅ **Verified** — *Real, peer-reviewed, available via your library.*
- ⚠️ **Predatory journal** — *Not indexed in Web of Science.*
- ⚠️ **Preprint** — *Not peer-reviewed; awaiting publication.*
- ⚠️ **Inaccessible** — *Real, but not in your library's entitlements.*
- ❌ **Unverified** — *Possible AI hallucination.*

For each, also show whether the player flagged it (✓ caught / ✗ missed / ⚠ false flag).

Show user's score breakdown:
- Issues caught: X/4
- False flags: Y
- Time used: Zs
- **Final score: NNN**

Encouraging message based on performance (e.g., "Nice eye!" / "Tough one — even experts miss these" / "Top 10% so far today!").

"SEE WHAT NEXUS DOES" button.

**Why categories appear here, not during the game:** The challenge screen kept the interaction simple (binary flag). The results screen is where players learn *what kinds of issues exist* — and seeing those same labels reappear on the next screen as Nexus's output makes the value prop concrete: "Nexus knows all five of these patterns and detects them in 2 seconds."

### Screen 7: Nexus Reveal
- Same mock chat interface, now with a Nexus Extend overlay/sidebar
- Animated 2-second "scanning" effect
- All 5 citations get instant badges (matching the truth from screen 6)
- Caption: *"Nexus scanned all 5 citations in 2 seconds, against Web of Science and the Central Discovery Index."*
- "SEE WHAT ELSE IT DOES" button

### Screen 8: Guided Tour (3 short steps)
1. **One-click full text:** Tap a verified citation → Nexus shows "Available via [Their Library]" → opens a mock article view
2. **Trusted alternatives:** Tap a flagged citation → Nexus suggests 2-3 verified alternatives from WoS
3. **Library services:** Floating Nexus widget shows "Need help? Chat with a [Their Library] librarian" + library hours

Each step has a "NEXT" button. Total: ~45 seconds.

### Screen 9: Leaderboard Entry
- Headline: *"Put your name on the board"*
- Form:
  - Name (required, free text, max 30 chars)
  - Institution (pre-filled from screen 2, editable)
  - Email (optional, with validation)
  - Checkbox (unticked): "Email me about Nexus Extend early access"
- "ADD ME TO THE LEADERBOARD" button
- "Skip" link (still records anonymously for analytics)

### Screen 10: Final Screen
- *"You're #N on the leaderboard!"*
- Show top 10 with the user's row highlighted
- QR code: "Scan to get your personalized summary" (links to a page showing the citations they missed + Nexus pitch)
- "Tell a friend to beat your score" with a second QR code
- Auto-reset to Screen 1 after 15 seconds OR "PLAY AGAIN" / "DONE" buttons

---

## 4. Scoring Formula

```
score = (issues_correctly_flagged × 100)
      − (false_flags × 50)
      − max(0, seconds_elapsed − 20)
```

- 4 actual issues per scenario, max 400 from accuracy
- Each false flag costs 50
- First 20 seconds are "free thinking time"; every second after deducts 1 point
- Minimum score: 0 (no negatives)
- Tie-breaker: fewer false flags wins, then faster time

---

## 5. Content: 6 Pre-Built Scenarios

Each scenario needs:
- Research question
- AI-generated response (~150 words, 5 inline citations)
- 5 citations with the following mix:
  - 1 fully fabricated (plausible authors, real-sounding journal, doesn't exist)
  - 1 predatory journal (real publication, but on Beall's-list-style outlet)
  - 1 preprint presented as peer-reviewed
  - 1 inaccessible (real, paywalled, not in typical library entitlements)
  - 1 fully verified (real, peer-reviewed, accessible)
- For the "Nexus alternatives" feature: 2-3 verified replacements per flagged citation

**You'll need a content team to draft these.** For prototype, generate plausible placeholders Claude Code can wire up. Replace with real, vetted scenarios before the show.

---

## 6. Technical Architecture

### Stack recommendation
- **Frontend:** React + Vite (fast dev, simple deployment)
- **Styling:** Tailwind CSS
- **State:** React state for session
- **Storage:** SQLite (via better-sqlite3) running locally on the kiosk
- **Deployment:** Single Electron app OR Chrome in `--kiosk` mode pointing at localhost
- **No network required at runtime**

### Offline-first design
**The booth runs on a single kiosk with no dependency on venue Wi-Fi.** Everything — scenarios, institution list, leaderboard, email capture — lives in local SQLite on the kiosk machine. No backend server required.

Email opt-ins are queued locally and exported via the admin panel as CSV at end of day for follow-up. The leaderboard is local-only (no cloud sync needed since there's only one station).

### Key data models

```
Sessions table:
  id, started_at, completed_at, institution, discipline,
  score, issues_caught, false_flags, time_elapsed_sec

Leaderboard entries:
  id, session_id, display_name, institution, score,
  email (nullable), email_opt_in (boolean), created_at

Scenarios (static JSON, not in DB):
  discipline, question, ai_response_text, citations[5]
```

### Project structure
```
/src
  /components
    WelcomeScreen.jsx
    InstitutionSelect.jsx
    DisciplineSelect.jsx
    ChallengeScreen.jsx
    ResultsScreen.jsx
    NexusRevealScreen.jsx
    GuidedTour.jsx
    LeaderboardEntry.jsx
    FinalScreen.jsx
    /shared
      Timer.jsx
      CitationCard.jsx
      ChatMockup.jsx
      NexusBadge.jsx
  /data
    institutions.json
    scenarios.json
  /lib
    scoring.js
    supabase.js (or api.js)
  /styles
  App.jsx
  main.jsx
```

---

## 7. Nexus UI Reference (matches the real product)

The booth demo's mock chat interface and Nexus overlay must visually match the real Nexus Extend product. Reference screenshots will be provided alongside this spec. Below is the extracted visual language.

### 7.1 Top-level chrome

The mock browser shows tabs at the top:
- **ChatGPT tab** (left): green ChatGPT logo + "ChatGPT" label
- **Extension puzzle icon** (right): subtle puzzle-piece icon

**The "Nexus Setup" tab from earlier mockups should NOT appear in the booth demo.** Only the ChatGPT tab and the extension icon are shown.

Tab styling: white/light gray background, simple horizontal bar across the top of the viewport.

### 7.2 Chat area (left side)

- White background, full-height
- **User avatar:** solid purple/blue rounded square (~40×40px) with a small person/user icon centered. Sits to the left of the user's message text.
- **AI avatar:** solid GREEN rounded square (~40×40px) with a sparkles ✨ icon centered (NOT purple — green, matching ChatGPT's brand color but with the sparkles icon instead of the ChatGPT logo). Sits to the left of the AI's message text. The green ChatGPT logo proper is reserved for the top tab only.
- Long-form text in clean sans-serif, comfortable line-height
- Bottom: input box reading "Message ChatGPT..." with a paper-plane send button on the right (purple background button). Can be hidden during the challenge phase to reduce visual noise.

### 7.3 Inline citation pills (in the chat text)

Citations appear inline with the prose. Each citation has TWO adjacent pill-style badges. **In the new design, the author/year pill carries a status icon directly — this is a key change from earlier mockups.**

**Author/year pill (always present, with embedded status):**
- Pill shape with light gray background and thin border
- Text: "Author et al., Year" (e.g., "Orben et al., 2022")
- **Embedded status icon at the right edge of the pill** — visible as part of the pill itself:
  - ✅ Green checkmark circle — **Verified**
  - ⚠️ Orange/yellow warning triangle — **Predatory journal** or **Non-scholarly**
  - 🔒 Gray padlock — **Paywalled / Inaccessible**
  - ❌ Red X — **Unverified / Possible hallucination**
- The pill background may also subtly tint to match status (e.g., very light green for verified, light yellow for predatory, light red for unverified) — keep tints subtle, the icon is the primary signal

**Action pill (always present, immediately to the right of the author pill):**
- White background with red border and red text
- Same pill shape
- Two variants:
  - **"Full Text"** with a small icon (open book or check) — for citations where Nexus has full-text access
  - **"View Page"** — for citations linking to a webpage rather than a paper

Both pills sit inline with the surrounding text, with small horizontal spacing.

**Critical design note for the booth:**
- During the **Challenge screen (Screen 5)**, citations should appear *without* the embedded status icon — just the plain author/year + Full Text/View Page pills, identical to what raw ChatGPT output would look like. The status icons are part of the **Nexus reveal (Screen 7)** — they appear on the pills *only after* Nexus "scans" the page. This animation (pills gaining status icons) is the visual payoff of the reveal moment.

### 7.4 Nexus collapsed state (floating badge)

When Nexus is "active but collapsed" — i.e., before the user opens the panel — it appears as a small floating card in the top-right of the viewport.

**Two collapsed variants:**

**Variant A — Idle / branding only:**
- Small white card with rounded corners and subtle shadow
- Red square logo with white globe icon on the left
- "UGS Libraries" (institution name, bold, dark text)
- "Nexus Academic Assistant" (smaller, lighter text below)
- Expand arrow (↗) on the right

**Variant B — Detection state (with red CTA):**
- Same card structure
- Red logo on left
- Bold "UGS Libraries" + "Nexus Academic Assistant" (top two lines)
- **Third line in red text:** "9 sources found • Click to verify"
- This is the key state for the booth — visually pulls the eye and signals action

The booth demo will animate from Variant A to Variant B during the "Nexus scanning" beat, then transition to expanded state on click.

### 7.5 Nexus expanded sidebar

When the user taps the badge, it expands into a right-side panel (~30% of viewport width).

**Sidebar header (white style, consistent across all states):**

- White background, full-width
- Red square logo box on left (~40×40px) with white globe icon
- "UGS Libraries" (bold, dark, ~18px) on top
- "Nexus Academic Assistant from Clarivate" (smaller, gray, ~14px) below
- Top right: expand icon (↗) — used to expand the sidebar to fullscreen, or collapse back to badge

**Tabs below the header:**
- **"Sources Cited on Page"** (default selected for booth demo) — pill-style toggle with white background and dark text when active
- **"Related Scholarly Sources"** — gray text when inactive

**"Sources Cited on Page" content (primary booth view):**

Section title: "Sources Cited on Page" (bold, dark)

Light gray informational box: *"Checking ChatGPT sources against your library's academic databases. Always double-check ChatGPT claims for accuracy."*

**Counts row — simplified two-state in new design:**
- ✅ green check + "**X Verified**" — followed by gray caption "= Source confirmed for research"
- ⚠️ orange warning + "**Y Unverified**" — followed by gray caption "= Partial or no academic match"

(If you have a third state like "Predatory" or "Non-scholarly," it can either be folded into "Unverified" for booth simplicity, or shown as a third row with its own icon and caption.)

**Citation cards in the list:**

Each card includes:
- Title (bold, dark, ~16px)
- Authors line (gray, smaller): e.g., "Cox, A. M., Pinfield, S., & Rutter, S."
- Bullet separator + Journal name + year: e.g., "• IFLA Journal (2019)"
- Metadata row with citation count + small action tags: "📄 156 Web of Science citations ↗" + "Article" pill + "Peer-reviewed" pill
- **Library availability footer (light gray background panel inside the card):**
  - Top line: "In UGS Libraries collection • View source details ↗"
  - Action row: "↗ View Full Text" / "💬 Cite ▾" / "📤 Export to ▾" (all in red)
- Status indicator on the right edge of the card: green check, orange warning, etc.

**"Related Scholarly Sources" content:**

Same overall layout, but cards are numbered (#1, #2, #3...) and include a "Why this source" explainer at the top of the panel.

### 7.6 Inline citation popup — Verified state

When the user taps a verified citation pill in the chat, a popup appears anchored to that citation:

- White card with rounded corners and shadow
- Document icon (📄) top-left
- Title (bold, dark): full paper title
- Authors line (smaller, gray with year): e.g., "Cox, A. M., Pinfield, S., & Rutter, S. (2019)"
- Journal name on its own line: e.g., "IFLA Journal"
- Stats row: "📄 156 Web of Science citations"
- **Green availability pill (full width):** "Available through UGS Libraries"
- **Red CTA button (full width):** "↗ View Full Article"
- Two secondary buttons below: "💬 Cite ▾" and "📤 Export to ▾"

### 7.7 Inline citation popup — Unverified state

For citations that fail verification, the same popup structure but with different content:

- **Open book icon** (📖) top-left (NOT a warning triangle — the icon is neutral; the warning is in the message body)
- Title (bold, dark): full paper title
- Authors line with year: e.g., "Peterson, M. (2023)"
- Journal name on its own line: e.g., "Library Technology Reports"
- **Red/pink message block:** "**Source not verified.** This source could not be verified in academic databases and may not exist or meet academic research standards. Always verify sources before citing them."
- **Two action buttons at the bottom (no primary CTA):** "💬 Cite ▾" and "📤 Export to ▾"

**Important change from earlier mockups:** This popup no longer has a "Find Verified Alternative" CTA button. The path to alternatives is now through the sidebar's "Related Scholarly Sources" tab instead. For the booth demo, when a player taps an unverified citation during Screen 8 step 2, the flow is:

1. Show the unverified popup with the warning message
2. After ~2 seconds (or on a "See alternatives" tap), close the popup and animate the sidebar to the "Related Scholarly Sources" tab to show 2-3 verified alternatives

This is a slightly less direct path than before, but matches the real product behavior.

### 7.7a Library services panel (lower section of sidebar)

The bottom portion of the Nexus sidebar (visible when scrolling down on either tab, or as a dedicated section) shows library service information:

- **"Library Hours" section** with a clock icon (🕐) header
  - Weekday rows: "Monday - Thursday: 7:00 AM - 12:00 AM" / "Friday: 7:00 AM - 8:00 PM" / "Saturday: 9:00 AM - 6:00 PM" / "Sunday: 10:00 AM - 12:00 AM"
  - Each line: day on the left, hours on the right, gray separator
- **"Contact Information" section** with an envelope icon (✉️) header
  - Phone number row: "📞 (555) 123-4567" (red text, tappable)
  - Email row: "✉️ library@ugs.edu" (red text, tappable)
- **"Quick Links" section** (no icon, bold header)
  - List of links in red text with external-link icons:
    - "Research Guides ↗"
    - "Library Catalog ↗"
    - "Ask a Librarian ↗"
    - "Visit Us ↗"

For booth Screen 8 step 3 (Library services), the demo can scroll the sidebar to show this section, OR display it as a focused callout. Either approach communicates the value: *"Nexus surfaces library services where users actually work."*

### 7.8 Color tokens (extracted from screens)

```
Nexus red (primary brand):     #C8102E or similar (CTA buttons, logo, alerts)
Nexus red dark hover:          slightly darker variant
Verified green:                #1A7F37 or similar (check marks, "Available" text)
Verified green background:     #DCFCE7 or similar (subtle green tint for "Available" pill)
Warning yellow:                #D97706 or similar (Non-Scholarly triangle)
Warning yellow background:     #FEF3C7 or similar
Unverified red text:           same as primary brand red
Card background:               #FFFFFF
Page background:               #FFFFFF / very light gray
Border gray:                   #E5E7EB
Body text:                     #111827 (near black)
Secondary text:                #6B7280 (mid gray)
Citation pill border:          #D1D5DB gray
Action pill border (red):      Nexus red
```

For exact hex values, sample from the source PNGs during build.

### 7.9 Typography

- Sans-serif throughout (matches real ChatGPT and Nexus)
- Body text: ~16px
- Headers: 18-20px bold
- Pills/badges: 13-14px
- Letter-spacing slightly tight on bold text

### 7.10 Mapping to booth screens

For the booth flow:

| Booth screen | Nexus state shown |
|---|---|
| Screen 5 (Challenge) | Chat only — no Nexus sidebar visible. Inline citations show as plain author/year + Full Text/View Page pills with NO embedded status icons. The player evaluates them manually. |
| Screen 7 (Nexus Reveal) | Animate Nexus collapsed badge → expanded sidebar (white header style). Each inline citation pill animates to add its embedded status icon (✅ ⚠️ 🔒 ❌) — this is the visual payoff. Sidebar opens to "Sources Cited on Page" tab showing the verified/unverified counts and citation list. |
| Screen 8 step 1 (Full text) | Tap a verified citation → show the verified popup (section 7.6) → "View Full Article" → fade to a mock article page |
| Screen 8 step 2 (Alternatives) | Tap an unverified citation → show the unverified popup (section 7.7) with the "Source not verified" message → after ~2 seconds (or user tap), close popup and animate sidebar to "Related Scholarly Sources" tab showing 2-3 verified alternatives |
| Screen 8 step 3 (Library services) | Scroll sidebar to show the Library Hours / Contact / Quick Links section (section 7.7a) |

**Note on always-on vs scan-and-reveal:** The real Nexus Extend product is "always-on" — citation status icons appear automatically as the page loads. For the booth demo, we deliberately adopt a "scan-and-reveal" pattern: citations start without icons (simulating raw ChatGPT output), then animate to show the icons during Screen 7. This is a stylistic choice to make the value of Nexus more dramatically visible to a booth visitor in a 60-second interaction. The end-state matches the real product; only the transition is theatrical.

---

## 8. Visual / UX Requirements

- **Touch-first:** all targets minimum 60×60px, no hover-dependent behavior
- **Resolution:** design for 1920×1080 landscape kiosk monitors
- **Idle reset:** if no input for 90 seconds on any screen, reset to Welcome
- **No browser chrome:** runs in fullscreen kiosk mode (Chrome `--kiosk` flag)
- **Sound:** subtle UI sounds for flag/submit/correct/incorrect — toggle-able from a hidden admin gesture
- **Branding:** Clarivate/Nexus brand colors and typography (provide brand guide separately)
- **Accessibility:** high contrast, large text, but kiosk-style (no screen reader needed for v1)

---

## 9. Admin Features

Hidden admin panel (access via 5-tap on logo or specific key combo):
- View all sessions / export to CSV
- Reset leaderboard
- Skip/replay scenarios for testing
- Toggle scenarios on/off
- Display server connection status

---

## 10. Build in This Order (for fastest demo-able prototype)

**Phase 1 — Core loop (1-2 days)**
1. Project setup, Tailwind, routing
2. Welcome + Institution + Discipline screens (static, no backend)
3. One scenario hardcoded
4. Challenge screen with timer and flagging
5. Results + Nexus reveal screens
6. Scoring logic

**Phase 2 — Polish and content (1-2 days)**
7. Guided tour
8. Leaderboard entry + final screen (use localStorage initially)
9. All 6 scenarios wired up
10. Idle reset, transitions, animations

**Phase 3 — Persistence + admin (1 day)**
11. SQLite setup with better-sqlite3
12. Leaderboard persistence
13. Admin panel
14. CSV export of sessions and email opt-ins

**Phase 4 — Hardening (1 day)**
15. Kiosk mode setup (Chrome --kiosk or Electron wrapper)
16. Idle reset, error recovery
17. End-to-end testing on actual kiosk hardware

---

## 11. Open Questions to Resolve Before Build

- Final brand assets and colors (request from Clarivate design team)
- Final scenario content (needs content/SME review)
- Real Nexus extension UI screenshots/mockups for the "reveal" — should match actual product
- Hardware spec for kiosk (touchscreen size, OS)
- Network situation at ALA venue (offline fallback needed?)
- Privacy/GDPR/CCPA compliance review for email capture
- Take-home summary page: hosted where?

---

## 12. Success Metrics to Capture

The app should log per session:
- Completion rate (started vs finished)
- Average time per screen
- Score distribution
- Email opt-in rate
- Most-played discipline
- Drop-off points
