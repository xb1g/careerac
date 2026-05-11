---
name: CareerAC
description: AI-native community college transfer planning platform
colors:
  primary: "#2563eb"
  primary-deep: "#1d4ed8"
  primary-soft: "#dbeafe"
  indigo: "#4f46e5"
  indigo-soft: "#e0e7ff"
  neutral-950: "#09090b"
  neutral-900: "#18181b"
  neutral-800: "#27272a"
  neutral-700: "#3f3f46"
  neutral-600: "#52525b"
  neutral-500: "#71717a"
  neutral-400: "#a1a1aa"
  neutral-300: "#d4d4d8"
  neutral-200: "#e4e4e7"
  neutral-100: "#f4f4f5"
  neutral-50: "#fafafa"
  background: "#ffffff"
  background-dark: "#0a0a0a"
  foreground: "#171717"
  foreground-dark: "#ededed"
  success: "#10b981"
  success-soft: "#d1fae5"
  warning: "#f59e0b"
  warning-soft: "#fef3c7"
  danger: "#ef4444"
  danger-soft: "#fee2e2"
typography:
  display:
    fontFamily: "var(--font-funnel-display), system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-funnel-display), system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-funnel-sans), system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-funnel-sans), system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-funnel-sans), system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.neutral-900}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.neutral-800}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.neutral-800}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-600}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  card-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-glass:
    backgroundColor: "rgba(255,255,255,0.7)"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge-default:
    backgroundColor: "{colors.neutral-100}"
    textColor: "{colors.neutral-800}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-primary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
---

# Design System: CareerAC

## 1. Overview

**Creative North Star: "The Open Road"**

CareerAC's visual system is built around the metaphor of an open road: directional, uncluttered, and always moving forward. Every surface guides the eye along a clear path. There are no dead ends, no visual noise, no decorative detours. The interface feels like a well-designed map: information is layered by importance, the primary route is unmistakable, and recovery from a wrong turn is frictionless.

This is a product-first system. The landing page may borrow atmospheric depth from brand registers, but the core experience — the plan builder, the course cards, the recovery flows — is pure tool. Density is high where students need to see their full semester at a glance, but never overwhelming. Breathing room is earned through hierarchy, not empty space.

The system explicitly rejects: cluttered dashboards, generic SaaS template aesthetics, bureaucratic academic portal designs, and overly playful gamification. Every element must justify its presence to a student using this at 11pm under pressure.

**Key Characteristics:**
- Flat-by-default surfaces with tonal layering for depth
- Directional blue accent used sparingly as the "path forward" signal
- High information density in plan views, generous rhythm in marketing surfaces
- No physical movement on interaction — color and shadow shifts only
- Glassmorphism reserved for floating chrome (header, modals), never content cards

## 2. Colors

The palette is restrained: tinted neutrals with a single blue accent family. The blue carries the "forward" metaphor — it marks the current path, active states, and primary actions. Everything else recedes.

### Primary
- **Path Blue** (#2563eb): The primary action color. Used for CTA buttons, active course states, links, and progress indicators. It should feel like the highlighted route on a map.
- **Path Blue Deep** (#1d4ed8): Hover and pressed states for primary actions. Slightly deeper, never muddy.
- **Path Blue Soft** (#dbeafe): Subtle tint backgrounds for badges, selected states, and soft highlights. Never used as text.

### Secondary
- **Horizon Indigo** (#4f46e5): Used sparingly for secondary emphasis, gradient pairings with Path Blue, and the occasional accent dot. Less saturated than the primary to maintain hierarchy.
- **Horizon Indigo Soft** (#e0e7ff): Background tint for indigo-accented elements.

### Neutral
- **Road Asphalt** (#18181b): Primary text on light backgrounds. Near-black with a subtle warm tint.
- **Road Surface** (#27272a): Secondary text, headings, button backgrounds.
- **Road Marking** (#52525b): Body text, descriptions, inactive labels.
- **Road Shoulder** (#a1a1aa): Placeholder text, disabled states, subtle borders.
- **Road Bed** (#e4e4e7): Dividers, light borders, card outlines.
- **Road Bed Light** (#f4f4f5): Subtle background tints, zebra striping, hover backgrounds.
- **Sky Light** (#fafafa): Page background on light mode. Not pure white — a whisper of warmth.
- **Night Sky** (#0a0a0a): Dark mode page background. Deep, not black.
- **Night Text** (#ededed): Dark mode primary text. High contrast without harshness.

### Status
- **Milestone Green** (#10b981): Completed courses, success states, verified paths.
- **Caution Amber** (#f59e0b): Waitlisted courses, warnings, pending states.
- **Detour Red** (#ef4444): Failed courses, errors, destructive actions.

### Named Rules
**The One Path Rule.** The primary blue accent appears on no more than 10% of any given screen. Its scarcity is the point. If everything is highlighted, nothing is.

**The No Pure Black Rule.** Never use #000000 or #ffffff. Every neutral is tinted slightly warm. The dark mode background is #0a0a0a, not #000000.

## 3. Typography

**Display Font:** Funnel Display (with system-ui fallback)
**Body Font:** Funnel Sans (with system-ui fallback)

The pairing is clean and modern with a subtle technical confidence. Funnel Display carries weight and authority for headlines without feeling corporate. Funnel Sans is highly legible at small sizes, which matters for dense plan views. Together they feel like a tool that knows what it's doing.

### Hierarchy
- **Display** (800, clamp(2.5rem, 7vw, 4.5rem), 1.08 line-height): Hero headlines only. Used on the landing page hero and major section headers. Tracking tight (-0.02em) for impact.
- **Headline** (700, clamp(1.75rem, 4vw, 3rem), 1.1 line-height): Section titles, page headers. Slightly looser tracking than display.
- **Title** (600, 1.125rem, 1.3 line-height): Card titles, dialog headers, semester labels. The workhorse of the product UI.
- **Body** (400, 0.875rem, 1.6 line-height): Descriptions, chat messages, plan details. Comfortable reading at density. Max line length 65ch.
- **Label** (600, 0.75rem, 1.4 line-height, 0.05em letter-spacing, uppercase): Navigation links, badges, metadata, status indicators. All caps with wide tracking for scannability.

### Named Rules
**The Size-13 Rule.** Navigation links and secondary actions use 13px (0.8125rem) with semibold weight. This is the system's smallest interactive text size. Nothing interactive goes below 13px.

**The Mono Codes Rule.** Course codes (CS A150, MATH A180) use the body font in bold with a slightly reduced size (0.625rem / 10px) and uppercase tracking. They read as labels, not body text.

## 4. Elevation

The system is flat by default. Depth is conveyed through tonal layering — background tints, border contrasts, and subtle shadow shifts on hover — rather than persistent drop shadows. This keeps the interface feeling grounded and map-like.

When shadows do appear, they are diffuse and ambient, never sharp or directional. The role is to lift an element slightly above its context, not to cast a realistic shadow.

### Shadow Vocabulary
- **Ambient Low** (`0 1px 2px rgba(24,24,27,0.05)`): Default card shadow. Barely perceptible.
- **Ambient Medium** (`0 8px 18px rgba(24,24,27,0.08)`): Hover state for cards and secondary buttons. A gentle bloom.
- **Ambient High** (`0 32px 64px -12px rgba(0,0,0,0.1)`): Hero demo sections, feature showcases. Dramatic but soft.
- **Inset Highlight** (`inset 0 1px 0 rgba(255,255,255,0.16)`): Primary buttons. Creates a subtle top-edge sheen.

### Glassmorphism (Restricted)
- **Floating Chrome** (`backdrop-blur-xl`, `bg-white/70`, `border-white/50`): Used exclusively for the fixed header and modal overlays. Never on content cards or data surfaces.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation). If a card doesn't need to feel interactive, it gets no shadow.

**The No Nested Cards Rule.** Cards inside cards are always wrong. Use tonal layering (background tints, borders) to create hierarchy within a single container.

## 5. Components

### Buttons
- **Shape:** Medium radius (12px) for standard buttons, full radius (9999px) for hero CTAs and pill-shaped actions.
- **Primary:** Road Surface background (#27272a) with white text. Inset top highlight sheen. Hover shifts to slightly lighter surface with ambient medium shadow. No physical lift — color and shadow only.
- **Secondary:** White background with Road Bed border (#e4e4e7), Road Surface text. Hover adds ambient medium shadow and darkens border.
- **Ghost:** Transparent background, Road Marking text (#52525b). Hover adds white background and Road Bed border.
- **Danger:** Detour Red background with white text. Follows primary button shadow pattern.
- **Focus:** 2px ring in Road Surface at 15% opacity, with 2px offset in background color.

### Cards
- **Default:** White background, Road Bed border (#e4e4e7), 16px radius, ambient low shadow. Used for data surfaces, plan views, settings panels.
- **Glass:** White at 70% opacity, backdrop blur, white/50 border, 24px radius. Used for floating overlays and atmospheric sections only.
- **Flat:** Transparent background, Road Bed border. Used when the card sits on an already-tinted background.
- **Internal Padding:** 24px default, 16px for compact data cards.

### Badges
- **Shape:** Full radius pill, 2px vertical / 10px horizontal padding.
- **Default:** Road Bed Light background, Road Surface text. For neutral labels.
- **Primary:** Path Blue Soft background, Path Blue Deep text. For active/verified states.
- **Success:** Milestone Green soft background, Milestone Green text. For completed/verified.
- **Warning:** Caution Amber soft background, Caution Amber text. For pending/waitlisted.
- **Danger:** Detour Red soft background, Detour Red text. For failed/errors.

### Inputs / Fields
- **Style:** 1px Road Bed border, white background, 12px radius, 10px 16px padding.
- **Focus:** Border shifts to Road Surface, no glow or ring. Clean and minimal.
- **Error:** Border shifts to Detour Red, with Detour Red text below.
- **Disabled:** Reduced opacity (50%), no pointer events.

### Navigation
- **Header:** Floating glass bar with backdrop blur, fixed to top. Full radius on desktop (pill shape), rounded-2xl on mobile.
- **Links:** 13px semibold, Road Marking color. Hover shifts to Road Asphalt. No underline.
- **Active:** Road Asphalt color, no additional treatment.

### Course Cards (Signature Component)
- **Shape:** 12px radius, 1px border, 10px 16px internal padding.
- **Status-driven color:** Background and border tint shift based on course status (planned = white/road bed, completed = milestone green soft, in-progress = path blue soft, failed = detour red soft).
- **Status dot:** 8px circle in status color, left of course code.
- **Status badge:** Pill badge with status color, appears only when status is non-planned.
- **Hover:** For interactive cards, ambient medium shadow appears. No lift.

## 6. Do's and Don'ts

### Do:
- **Do** use Path Blue sparingly. It should feel like a highlight, not a wash.
- **Do** maintain the flat-by-default rule. Shadows are for state, not decoration.
- **Do** use tonal layering (background tints, borders) to create hierarchy within containers.
- **Do** keep body text at 14px (0.875rem) minimum and interactive text at 13px (0.8125rem) minimum.
- **Do** use the full radius (pill shape) for hero CTAs and floating header bars.
- **Do** use glassmorphism exclusively for floating chrome (header, modals).
- **Do** celebrate milestones with Milestone Green, but keep the celebration subtle — a tint, not a banner.

### Don't:
- **Don't** create cluttered, overwhelming dashboards with dense data tables and excessive chrome. (From PRODUCT.md anti-references.)
- **Don't** use generic SaaS template aesthetics: identical card grids with icon + heading + text, gradient text, big-number hero metrics. (From PRODUCT.md anti-references.)
- **Don't** use academic/university portal designs that feel bureaucratic and dated. (From PRODUCT.md anti-references.)
- **Don't** use overly playful or gamified interfaces that undermine the seriousness of academic planning. (From PRODUCT.md anti-references.)
- **Don't** use side-stripe borders (border-left greater than 1px as a colored accent). The course card status accents are the only exception, and they use exactly 4px.
- **Don't** use gradient text (`background-clip: text`). The landing page hero uses it currently but this is deprecated — use a single solid color instead.
- **Don't** use glassmorphism on content cards or data surfaces. It reduces readability and feels decorative.
- **Don't** animate CSS layout properties (width, height, top, left). Use transform and opacity only.
- **Don't** use bounce, elastic, or spring easing. Use ease-out with exponential curves (ease-out-quart / quint).
- **Don't** wrap everything in a container. Most things don't need one.
