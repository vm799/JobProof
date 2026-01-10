# JobProof UI/UX Specification

## 1. Project Overview
**JobProof** is a high-fidelity enterprise mobile application designed for field service teams to provide undeniable "Proof of Work." It bridges the gap between field execution and back-office verification through real-time data, visual evidence, and geo-fencing.

---

## 2. Visual Identity
### 2.1 Color Palette
- **Primary:** `#137fec` (Electric Blue) - Represents trust, technology, and precision.
- **Success/Completed:** `#10b981` (Emerald) - Used for verified tasks and status.
- **Warning/Pending:** `#f59e0b` (Amber) - Highlights items requiring immediate attention.
- **Danger/High Priority:** `#ef4444` (Red) - Used for urgent alerts or rejections.
- **Backgrounds:** 
  - Light: `#f6f7f8` (Soft Gray)
  - Dark: `#101922` (Deep Navy)

### 2.2 Typography
- **Primary Font:** `Inter` (Sans-serif)
- **Scales:**
  - **Hero Title:** 5xl (Black/900) - For landing impact.
  - **Screen Headers:** Base (Bold/700) - For navigation clarity.
  - **KPI Numbers:** 3xl (Black/900) - For data prominence.
  - **Captions:** XS (Medium/500) - For metadata and timestamps.

### 2.3 Design Language
- **Corner Radius:** 2xl (1rem) for containers; lg (0.5rem) for buttons.
- **Elevation:** Low-profile shadow (`shadow-sm`) for standard cards; High-intensity shadow (`shadow-xl`) for actionable modals.
- **Iconography:** `Material Symbols Outlined` (Weight: 400).

---

## 3. Screen-by-Screen Breakdown

### 3.1 Landing & Onboarding
- **Visuals:** Dark-themed background with primary blue blurs (`blur-[120px]`).
- **Behavior:** Quick entry point emphasizing key value propositions.
- **CTA:** High-contrast "Launch Terminal" button.

### 3.2 Authentication (Role Selection)
- **Visuals:** Minimalist white/deep-navy background.
- **Component:** "Role Cards" with high-affordance hover states and distinctive icons.
- **Logins:** Integrated SSO options (Google, Azure AD).

### 3.3 Technician Interface (My Jobs)
- **Component: Day Scroller:** Horizontal snap-scrolling date selection.
- **Component: Job Cards:** 
  - "Action Required" cards feature a hero image and orange warning banners.
  - Standard cards emphasize address and time window.
- **Navigation:** Fixed bottom bar with centered "Quick Add" (optional for managers).

### 3.4 Job Detail & Execution
- **Layout:** Progress tracking at the top (33%, 66%, 100%).
- **Checklist Pattern:**
  - *Completed:* Opacity 70%, green checkmarks, thumbnail preview.
  - *Active:* Primary blue border, high-contrast text, direct "Chevron" access to camera.
  - *Locked:* Grayed out until previous steps are met.
- **Main Action:** "Capture Evidence" fixed bottom button for thumb-reach access.

### 3.5 Camera Mode (Simulated)
- **Visuals:** Full-screen immersive black interface.
- **UI Overlays:**
  - Viewfinder brackets for alignment.
  - "Shutter" flash effect (white-out) on capture.
  - Task-specific header ("SAFETY EQUIPMENT CHECK").

### 3.6 Manager Operations (Dashboard)
- **Visuals:** Multi-column KPI grid (Active, Pending, Done, Team).
- **Behavior:** Focus on the "Review Queue."
- **Review Card:** Combines technician avatar, notes, and evidence thumbnail in a single digestible unit.

### 3.7 Detailed Review (Approval Screen)
- **Visuals:** Large aspect-square photo evidence with metadata overlays (GPS, Time).
- **Logic:** Triple-action footer: "Request Info", "Reject", or "Approve & Mark Complete."

---

## 4. Interaction Principles
1. **Feedback Loops:** Buttons use `active:scale-95` to simulate physical resistance.
2. **Transitioning:** Smooth `duration-200` color transitions for dark-mode switching.
3. **Information Hierarchy:** Boldest weights reserved for labels; lightest weights for secondary metadata.

## 5. Accessibility (A11y)
- **Contrast:** AA compliant contrast ratios for text on backgrounds.
- **Tap Targets:** Minimum 44x44px for all actionable icons.
- **ARIA:** Labels included for custom icons and progress indicators.
