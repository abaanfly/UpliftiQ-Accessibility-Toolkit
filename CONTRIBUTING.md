# Contributing to UpliftiQ Accessibility Toolkit

Thank you for helping improve accessible learning tools.

## Contribution principles

- Default to Deaf-first, visual-first interaction design
- Preserve keyboard accessibility in every component
- Maintain high contrast and readable caption sizing
- Prefer descriptive APIs and small modular components
- Document accessibility intent alongside behavior changes

## Getting started

1. Fork the repository
2. Install dependencies with `yarn install`
3. Start the demo app with `yarn dev:demo`
4. Make focused changes in one package at a time
5. Update docs and examples when behavior changes
6. Run `yarn release:check` before opening a pull request

## Pull request checklist

- [ ] Component has keyboard support where applicable
- [ ] Visual changes meet high-contrast requirements
- [ ] Usage example is updated
- [ ] README or docs updated when public APIs change
- [ ] Props remain developer-friendly and well named
- [ ] `CHANGELOG.md` mentions user-facing changes
- [ ] Package build output still succeeds for affected workspaces

## Documentation expectations

- Add or update copy-paste examples for every new public prop
- Keep beginner-friendly explanations alongside technical details
- Mention accessibility impact, not just API behavior
- Update `docs/api-reference.md` when component signatures change

## Release-minded contribution flow

```bash
yarn build
yarn test
yarn release:check
```

Use these commands before maintainers review a release-facing change.

## Accessibility review prompts

- Can a Deaf learner understand the flow without depending on sound?
- Are visual alerts clear without becoming distracting?
- Are captions readable at a glance on laptop and mobile screens?
- Is motion optional for people who prefer reduced motion?
