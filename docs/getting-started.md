# Getting Started

## Install packages with npm

```bash
npm install @upliftiq/caption-player @upliftiq/deaf-ui @upliftiq/isl-tools
```

## Choose a starting path

- **Single feature adoption:** start with `@upliftiq/caption-player` if you need caption-first video immediately
- **Full lesson interface:** add `@upliftiq/deaf-ui` for alerts, cards, and timers
- **Sign-ready flow:** add `@upliftiq/isl-tools` when sign practice and loop playback matter

## Add a captioned lesson

```tsx
import { CaptionPlayer } from "@upliftiq/caption-player";

export function Lesson() {
  return (
    <CaptionPlayer
      video="/videos/lesson.mp4"
      captions={[
        { src: "/captions/lesson-en.vtt", srclang: "en", label: "English", default: true },
        { src: "/captions/lesson-hi.vtt", srclang: "hi", label: "Hindi" },
      ]}
      title="Lesson 1"
      signOverlayVideo="/signs/lesson-isl.mp4"
      signOverlayLabel="ISL interpreter"
      defaultCaptionLanguage="en"
    />
  );
}
```

Use the built-in caption controls to switch languages, change size and theme, search the transcript, enable Accessibility Mode, and switch between picture-in-picture or split sign-language overlay layouts.

## Recommended first setup checklist

1. Start with at least one readable WebVTT file
2. Add a second language track if your course is multilingual
3. Provide sign overlay media when instruction depends on sign language support
4. Test the transcript with keyboard-only navigation
5. Turn Accessibility Mode on and verify the expanded reading layout still fits your lesson content

## Accessibility Mode

Turn Accessibility Mode on when you want:

- XL captions
- high-contrast caption styling
- an expanded transcript panel
- a simplified controls layout
- sign overlay enabled by default when a sign video is provided

## Add visual-first learning blocks

```tsx
import {
  VisualAlert,
  CaptionCard,
  StepLearningCard,
  VisualTimer,
} from "@upliftiq/deaf-ui";
```

## Add sign learning content

```tsx
import { SignCard, SignVideoPlayer } from "@upliftiq/isl-tools";
```

## Run the demo app locally

```bash
yarn install
yarn dev:demo
```

The demo app lives in `examples/demo-learning-platform` and uses Vite, React, TypeScript, and CSS modules.

## Before sharing changes

```bash
yarn build
yarn test
yarn release:check
```
