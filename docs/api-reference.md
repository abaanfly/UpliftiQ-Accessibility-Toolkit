# API Reference

## `CaptionPlayer`

### Core props

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `video` | `string` | Yes | Path or URL to the lesson video |
| `captions` | `string \| CaptionTrack[]` | Yes | Single WebVTT file or multiple caption tracks |
| `title` | `string` | No | Accessible label for the player region |
| `transcriptTitle` | `string` | No | Heading used for transcript panel labeling |
| `signOverlayVideo` | `string` | No | Optional sign-language support video |
| `signOverlayLabel` | `string` | No | Explains the sign overlay content to learners |
| `defaultOverlayMode` | `"off" \| "pip" \| "split"` | No | Default sign overlay presentation |
| `defaultCaptionLanguage` | `string` | No | Sets the initial caption language when multiple tracks are available |

### `CaptionTrack`

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `src` | `string` | Yes | WebVTT source path |
| `srclang` | `string` | Yes | Language code such as `en` or `hi` |
| `label` | `string` | Yes | Human-readable language label |
| `default` | `boolean` | No | Marks the default caption track |

### Built-in behavior

- Clickable transcript lines jump playback time
- Search filters transcript lines and highlights matches
- Accessibility Mode enables larger captions, contrast styling, expanded transcript reading, and sign overlay support
- Keyboard shortcuts support search, transcript movement, seeking, playback, language switching, and overlay toggling

## `VisualAlert`

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Main alert heading |
| `message` | `string` | Yes | Supporting alert copy |
| `variant` | `"info" \| "success" \| "warning" \| "error"` | No | Visual tone of the alert |

## `CaptionCard`

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Main card heading |
| `caption` | `string` | Yes | Supporting text or learning summary |
| `meta` | `string` | No | Short label shown above the title |

## `StepLearningCard`

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `step` | `string` | Yes | Step indicator text |
| `title` | `string` | Yes | Step title |
| `description` | `string` | Yes | Step explanation |

## `VisualTimer`

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `seconds` | `number` | Yes | Countdown duration |
| `title` | `string` | No | Accessible timer label |

## `SignVideoPlayer`

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `video` | `string` | Yes | Sign video source |
| `title` | `string` | Yes | Accessible label for the player |

## `SignCard`

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `word` | `string` | Yes | Focus word or phrase |
| `video` | `string` | Yes | Sign video source |
| `description` | `string` | No | Practice guidance or explanation |
