# Release Guide

## Before opening a release

1. Update public docs (`README`, docs files, `CHANGELOG.md`)
2. Verify examples still match public APIs
3. Confirm accessibility changes were checked with keyboard navigation and readable contrast

## Local commands

```bash
yarn install
yarn build
yarn test
yarn release:check
```

## Package outputs

- `packages/caption-player/dist`
- `packages/deaf-ui/dist`
- `packages/isl-tools/dist`

These compiled outputs are what external consumers should install from npm.

## Publish commands

```bash
yarn publish:caption-player
yarn publish:deaf-ui
yarn publish:isl-tools
```

## Release checklist

- [ ] version updated where needed
- [ ] changelog updated
- [ ] docs reflect current props and examples
- [ ] build and release checks pass
- [ ] caption language switching and Accessibility Mode still work in the demo
