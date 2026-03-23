const docsMap = [
  {
    title: "Accessibility mission",
    description: "Clarifies why UpliftiQ prioritizes visual-first learning, readable captions, and sign-friendly experiences.",
    path: "docs/accessibility-mission.md",
    testId: "docs-map-accessibility-mission",
  },
  {
    title: "Getting started",
    description: "Shows installation, quick start usage, Accessibility Mode, and language-switching setup.",
    path: "docs/getting-started.md",
    testId: "docs-map-getting-started",
  },
  {
    title: "Component guide",
    description: "Explains CaptionPlayer, deaf-ui, isl-tools, keyboard behavior, and sign overlay patterns.",
    path: "docs/component-guide.md",
    testId: "docs-map-component-guide",
  },
  {
    title: "API reference",
    description: "Lists core props, track structure, and recommended behaviors for teams integrating the toolkit.",
    path: "docs/api-reference.md",
    testId: "docs-map-api-reference",
  },
  {
    title: "Release guide",
    description: "Summarizes build, test, release-check, and package publishing steps for maintainers.",
    path: "docs/release-guide.md",
    testId: "docs-map-release-guide",
  },
];

const contributionChecks = [
  "Does the change improve clarity for Deaf and Hard-of-Hearing learners?",
  "Can the flow be completed without depending on sound-only cues?",
  "Are keyboard shortcuts and focus states still obvious?",
  "Did you update docs, examples, and release notes for public APIs?",
];

const packageRows = [
  ["@upliftiq/caption-player", "Caption playback, searchable transcript, language switching, Accessibility Mode, sign overlay support"],
  ["@upliftiq/deaf-ui", "VisualAlert, CaptionCard, StepLearningCard, VisualTimer"],
  ["@upliftiq/isl-tools", "SignCard and SignVideoPlayer for looped, sign-friendly learning patterns"],
];

const exampleSnippet = `import { CaptionPlayer } from "@upliftiq/caption-player";

export function Lesson() {
  return (
    <CaptionPlayer
      video="/videos/lesson.mp4"
      captions={[
        { src: "/captions/lesson-en.vtt", srclang: "en", label: "English", default: true },
        { src: "/captions/lesson-hi.vtt", srclang: "hi", label: "Hindi" },
      ]}
      signOverlayVideo="/signs/lesson-isl.mp4"
      defaultCaptionLanguage="en"
    />
  );
}`;

export const DocumentationHub = () => {
  return (
    <div className="docs-hub" data-testid="documentation-hub">
      <nav className="docs-hub__nav" data-testid="documentation-hub-nav">
        <a href="#readme-guide" className="docs-hub__pill" data-testid="documentation-nav-readme-link">README guide</a>
        <a href="#docs-guide" className="docs-hub__pill" data-testid="documentation-nav-docs-link">Docs map</a>
        <a href="#contributing-guide" className="docs-hub__pill" data-testid="documentation-nav-contributing-link">Contributing guide</a>
      </nav>

      <section id="readme-guide" className="docs-hub__panel" data-testid="documentation-readme-panel">
        <div className="docs-hub__panel-header" data-testid="documentation-readme-header">
          <p className="eyebrow" data-testid="documentation-readme-eyebrow">README</p>
          <h3 data-testid="documentation-readme-title">Installation, package overview, and copy-paste usage examples</h3>
        </div>

        <div className="docs-hub__grid docs-hub__grid--two" data-testid="documentation-readme-grid">
          <article className="docs-hub__card" data-testid="documentation-install-card">
            <h4 data-testid="documentation-install-title">Install from npm</h4>
            <pre className="docs-hub__code" data-testid="documentation-install-command">npm install @upliftiq/caption-player @upliftiq/deaf-ui @upliftiq/isl-tools</pre>
          </article>

          <article className="docs-hub__card" data-testid="documentation-usage-card">
            <h4 data-testid="documentation-usage-title">Quick start example</h4>
            <pre className="docs-hub__code docs-hub__code--tall" data-testid="documentation-usage-snippet">{exampleSnippet}</pre>
          </article>
        </div>

        <div className="docs-hub__table-wrap" data-testid="documentation-package-overview-wrap">
          <table className="docs-hub__table" data-testid="documentation-package-overview-table">
            <thead>
              <tr>
                <th data-testid="documentation-table-package-header">Package</th>
                <th data-testid="documentation-table-purpose-header">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {packageRows.map(([pkg, purpose]) => (
                <tr key={pkg} data-testid={`documentation-package-row-${pkg.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
                  <td data-testid={`documentation-package-name-${pkg.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>{pkg}</td>
                  <td data-testid={`documentation-package-purpose-${pkg.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="docs-guide" className="docs-hub__panel" data-testid="documentation-docs-panel">
        <div className="docs-hub__panel-header" data-testid="documentation-docs-header">
          <p className="eyebrow" data-testid="documentation-docs-eyebrow">Docs</p>
          <h3 data-testid="documentation-docs-title">Accessibility mission, onboarding, API reference, and release guidance</h3>
        </div>

        <div className="docs-hub__grid docs-hub__grid--three" data-testid="documentation-docs-grid">
          {docsMap.map((item) => (
            <article className="docs-hub__card" key={item.title} data-testid={item.testId}>
              <h4 data-testid={`${item.testId}-title`}>{item.title}</h4>
              <p data-testid={`${item.testId}-description`}>{item.description}</p>
              <code className="docs-hub__path" data-testid={`${item.testId}-path`}>{item.path}</code>
            </article>
          ))}
        </div>
      </section>

      <section id="contributing-guide" className="docs-hub__panel" data-testid="documentation-contributing-panel">
        <div className="docs-hub__panel-header" data-testid="documentation-contributing-header">
          <p className="eyebrow" data-testid="documentation-contributing-eyebrow">Contributing</p>
          <h3 data-testid="documentation-contributing-title">Deaf-first contribution principles and review prompts</h3>
        </div>

        <div className="docs-hub__grid docs-hub__grid--two" data-testid="documentation-contributing-grid">
          <article className="docs-hub__card" data-testid="documentation-contributing-principles-card">
            <h4 data-testid="documentation-contributing-principles-title">Contribution workflow</h4>
            <ol className="docs-hub__list" data-testid="documentation-contributing-workflow-list">
              <li data-testid="documentation-contributing-workflow-step-1">Install dependencies with <code>yarn install</code>.</li>
              <li data-testid="documentation-contributing-workflow-step-2">Run <code>yarn dev:demo</code> to review changes in context.</li>
              <li data-testid="documentation-contributing-workflow-step-3">Update docs, examples, and changelog when public behavior changes.</li>
              <li data-testid="documentation-contributing-workflow-step-4">Run <code>yarn release:check</code> before sharing changes.</li>
            </ol>
          </article>

          <article className="docs-hub__card" data-testid="documentation-contributing-review-card">
            <h4 data-testid="documentation-contributing-review-title">Accessibility review prompts</h4>
            <ul className="docs-hub__list" data-testid="documentation-contributing-review-list">
              {contributionChecks.map((item, index) => (
                <li key={item} data-testid={`documentation-contributing-review-item-${index + 1}`}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
};
