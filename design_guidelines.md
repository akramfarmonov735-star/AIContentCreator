# Design Guidelines: AI Social Media Video Creator

## Design Approach

**Selected System:** Linear-inspired productivity interface with Material Design interaction patterns

**Rationale:** This is a utility-focused creative tool requiring clear workflow progression, powerful editing capabilities, and frequent user interaction with AI-generated content. Linear's clean aesthetics combined with Material Design's rich feedback patterns create an optimal balance for creative productivity tools.

## Core Design Elements

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Headings:** Font weight 600-700, sizes: text-3xl (steps), text-xl (sections), text-lg (subsections)
- **Body:** Font weight 400, text-base for descriptions, text-sm for labels
- **Code/Technical:** Font weight 500, text-sm (for script editing, timestamps)

### Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Card spacing: p-6
- Button padding: px-4 py-2 to px-6 py-3

**Container Strategy:**
- Main workflow: max-w-5xl centered
- Preview panels: max-w-3xl
- Editor areas: Full width within container with max-w-4xl for text

## Component Library

### Workflow Stepper
- Horizontal step indicator at top
- Active step highlighted with accent border
- Completed steps with checkmark icons
- Click previous steps to review (not edit)
- 5 main steps: Topic → Script → Images → Audio → Video

### Script Editor
- Large textarea with monospace font for script editing
- Character/word count at bottom right
- Scene breakdown with numbered sections
- Inline "Regenerate" button for each scene
- "Approve & Continue" primary action button

### Image Management Grid
- 2-column grid (md:grid-cols-2) for scene previews
- Each card shows: scene number, image preview, duration slider
- "Regenerate Image" button overlaid on hover
- "Replace with Upload" secondary action
- Duration input (seconds) with +/- controls

### Audio Controls
- Waveform visualization placeholder for voiceover
- Play/pause controls with progress bar
- Volume slider (0-100%)
- "Regenerate Voice" button
- Background music selector with preview buttons
- Music volume slider separate from voiceover

### Video Preview Panel
- 9:16 aspect ratio preview (centered, max-height viewport)
- Play controls below preview
- Timeline scrubber showing scene transitions
- "Re-render Preview" button
- Download button (primary) when ready

### Action Buttons
- Primary: Solid background, px-6 py-3, font-medium
- Secondary: Outline style, same padding
- Tertiary: Ghost style for "Regenerate" actions
- Icon buttons: Square, p-2, for media controls

### Form Controls
- Text inputs: border, rounded-lg, p-3, focus:ring-2
- Sliders: Custom styled range inputs with value display
- Textareas: min-h-48, resize-vertical allowed
- Dropdowns: Full-width, rounded-lg

### Cards & Panels
- Scene cards: border, rounded-xl, p-6, shadow-sm
- Preview panels: Elevated with shadow-lg
- Step containers: bg-subtle, rounded-2xl, p-8

### Progress Indicators
- Loading states: Spinner with "AI is generating..." text
- Progress bars for video rendering
- Skeleton screens for content loading

## Navigation & Layout

**Top Bar:**
- Logo/brand left
- Step indicator center
- "Save Draft" / "Exit" right

**Main Area:**
- Single-column flow for steps
- Sticky preview panel on larger screens (lg:sticky lg:top-4)
- Clear section headings with icons

**Footer Actions:**
- Always visible: "Back" (secondary) and "Continue" (primary)
- Right-aligned button group

## Animations
Minimal and purposeful:
- Smooth transitions between steps (opacity fade)
- Hover scale on cards (scale-105)
- Loading spinners for AI generation
- No scroll animations or decorative effects

## Images
**Where Images Are Used:**
1. Scene preview thumbnails (AI-generated or uploaded)
2. Example/placeholder images in empty states
3. No hero section - utility app goes straight to workflow

**Image Descriptions:**
- Scene thumbnails: 16:9 ratio, rounded-lg, object-cover
- Empty states: Illustration style, grayscale placeholder
- Icons throughout: Heroicons (outline style)

## Key UX Patterns

**Inline Editing Philosophy:**
- Every AI output has adjacent edit/regenerate controls
- No separate "edit mode" - everything editable in place
- Clear visual feedback when content is modified
- Undo capability for regenerations

**Progressive Disclosure:**
- Show one step at a time
- Preview previous work in collapsed cards
- Expand advanced options (transitions, effects) only when needed

**Feedback & Validation:**
- Immediate validation on inputs (duration limits, file sizes)
- Toast notifications for successful actions
- Error states with helpful recovery suggestions
- Loading states for all AI operations (5-30s expected)

This utility-first design prioritizes workflow efficiency while maintaining a polished, modern aesthetic appropriate for creative professionals producing social media content.