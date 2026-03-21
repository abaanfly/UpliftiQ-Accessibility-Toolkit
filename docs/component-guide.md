# Component Guide

## Caption Player

- HTML5 video with native keyboard-friendly controls
- WebVTT loading and parsing
- high-contrast live caption surface
- transcript list with click-to-seek behavior
- caption language switching with developer-defined tracks
- caption search with highlighted matches and no-results feedback
- adjustable caption size, line spacing, dark/light/high-contrast themes, and panel style
- one-click Accessibility Mode for larger captions, expanded transcript reading, and simplified controls
- keyboard shortcuts for search, transcript navigation, playback, seeking, language switching, and theme toggling
- optional sign-language overlay with picture-in-picture and split-view modes

### CaptionPlayer recommended props

```tsx
<CaptionPlayer
  video="/videos/lesson.mp4"
  captions={[
    { src: "/captions/lesson-en.vtt", srclang: "en", label: "English", default: true },
    { src: "/captions/lesson-hi.vtt", srclang: "hi", label: "Hindi" },
  ]}
  signOverlayVideo="/signs/lesson-isl.mp4"
  signOverlayLabel="ISL interpreter"
  defaultOverlayMode="pip"
  defaultCaptionLanguage="en"
/>
```

### Keyboard shortcuts

| Shortcut | Behavior |
| --- | --- |
| `/` | Focus caption search |
| `↑` / `↓` | Move transcript selection |
| `←` / `→` | Seek backward or forward |
| `Enter` | Jump to selected transcript cue |
| `Space` | Play or pause video |
| `L` | Switch caption language |
| `O` | Toggle sign overlay mode |
| `A` | Toggle Accessibility Mode |

### Accessibility Mode behavior

When enabled, the player automatically applies:

- XL caption sizing
- high-contrast caption styling
- expanded transcript reading space
- simplified controls emphasis
- sign overlay support as the preferred layout when sign media is available

## Deaf UI

### VisualAlert
Use for announcements, timer warnings, or task-state changes that might otherwise rely on sound.

### CaptionCard
Use to present lesson summaries, reflective prompts, or text-first explanations.

### StepLearningCard
Use for visual task breakdowns, procedures, and scaffolded learning sequences.

### VisualTimer
Use where time should be felt through motion and color instead of sound.

### Good pairing patterns

- `VisualAlert` + `CaptionPlayer` for lesson status changes
- `CaptionCard` + `StepLearningCard` for text-first reinforcement after a video segment
- `VisualTimer` + `SignVideoPlayer` for timed sign practice blocks

## ISL Tools

### SignVideoPlayer
Provides loop and slow playback controls for sign practice.

### SignCard
Pairs a word or phrase with sign video and short explanation text.

## Styling notes

- CSS modules keep package styles isolated
- colors prioritize WCAG-friendly contrast
- reduced motion should remain respected in every animation-enabled component
- make transcript panels wide enough for paragraph-length captions
- prefer readable content density over decorative UI clutter
