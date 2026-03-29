# UpliftiQ Accessibility Toolkit PRD

## Original Problem Statement
Create an open-source project called "UpliftiQ Accessibility Toolkit".

Purpose:
Build a developer toolkit that helps create Deaf-friendly learning platforms.
The toolkit should prioritize accessibility for Deaf and Hard-of-Hearing users.

Technology stack:
- React
- TypeScript
- Vite
- CSS modules
- WebVTT for captions

Required structure:
- packages/caption-player
- packages/deaf-ui
- packages/isl-tools
- examples/demo-learning-platform
- docs
- README.md
- LICENSE
- CONTRIBUTING.md

Modules:
- CaptionPlayer with HTML5 video, WebVTT subtitle support, large readable captions, high contrast caption styling, transcript panel, click-to-seek transcript, keyboard accessible controls
- Deaf-friendly UI components: VisualAlert, CaptionCard, StepLearningCard, VisualTimer
- ISL learning tools: SignCard, SignVideoPlayer with slow playback and loop playback
- Demo app with lesson page using CaptionPlayer, CaptionCard, VisualAlert
- Documentation with npm installation, usage examples, accessibility mission statement
- MIT License

## User Choices
- Scope: frontend toolkit + simple docs/demo app only
- Workspace setup: best default used
- Demo style: professional accessibility-first UI
- Documentation depth: full docs structure with examples and accessibility guidance

## Architecture Decisions
- Created root monorepo-style structure under /app with workspaces for packages and examples
- Implemented package source in React + TypeScript with CSS modules under packages/*
- Implemented Vite demo app source under examples/demo-learning-platform
- Kept /app/frontend as live preview shell for the current environment so the toolkit can be reviewed visually right away
- Used WebVTT parsing logic for caption sync and transcript seeking
- Added visible caption error states and data-testid coverage for interactive elements

## User Personas
- Accessibility-focused frontend developers building education products
- Product teams prototyping Deaf-friendly lesson experiences
- Educators and learning designers validating caption-first UI patterns
- Teams exploring Indian Sign Language friendly learning interactions

## Core Requirements
- Modular package structure
- Caption-first learning player
- Visual-only alternatives to sound cues
- Sign-learning oriented playback controls
- Example lesson page
- Clear documentation and contribution guidance
- MIT licensing

## What Has Been Implemented
### 2026-03-10
- Added root open-source project files: README, LICENSE, CONTRIBUTING, package.json, tsconfig base
- Added docs: accessibility mission, getting started, component guide
- Built packages/caption-player with WebVTT parsing, high-contrast caption surface, transcript click-to-seek, and caption error state
- Enhanced CaptionPlayer with transcript search, adjustable caption size, dark/light/high-contrast themes, line spacing and panel style controls, keyboard shortcuts, and sign-language overlay modes (off / PiP / split)
- Added English/Hindi caption language switching and one-click Accessibility Mode with XL captions, expanded transcript behavior, simplified controls, and default sign overlay support
- Built packages/deaf-ui with VisualAlert, CaptionCard, StepLearningCard, and VisualTimer
- Built packages/isl-tools with SignVideoPlayer and SignCard
- Built examples/demo-learning-platform Vite source with a lesson page composed from the toolkit packages
- Replaced default frontend with a professional accessibility-first live preview showcasing the toolkit sections and interactive demos
- Updated the live preview and demo app to expose the new caption accessibility controls and sign overlay behavior
- Added data-testid attributes to critical interactive elements and package-level controls
- Updated README and docs to cover the improved caption player API and controls
- Added CODE_OF_CONDUCT, CHANGELOG, release smoke scripts, package publish metadata, dist build config, and verified workspace builds
- Expanded the documentation bundle with deeper README guidance, API reference, release guide, and an in-app docs hub for README / Docs / Contributing content
- Respected reduced-motion preference in transcript auto-scroll behavior
- Self-tested live preview interactions, verified `yarn build`, `yarn test`, and `yarn release:check`, and validated frontend flows through testing agent reports iteration_1, iteration_2, iteration_3, and iteration_4

## Prioritized Backlog
### P0 Remaining
- Add automated unit tests for WebVTT parsing and component interactions
- Add formal keyboard shortcut documentation and package-level accessibility tests for reduced-motion behavior
- Add publish workflow automation for package versioning and release notes generation

### P1 Remaining
- Expand demo content with authentic lesson media assets and multiple caption tracks
- Add accessibility audit checklist and browser support notes
- Split the large preview stylesheet into smaller focused style files for maintainability

### P2 Remaining
- Add additional sign practice patterns such as phrase grouping and review history
- Add more visual alert variants and localization examples
- Add richer documentation site styling or Storybook-style component explorer

## Next Tasks List
- Add component test coverage
- Expand demo lessons and sign-learning examples
- Add localization and multi-language caption examples
- Add automated release workflow for npm publishing
