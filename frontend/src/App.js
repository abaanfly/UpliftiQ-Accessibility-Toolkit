import { ArrowRight, BookOpenText, Captions, HandMetal, VolumeX } from "lucide-react";
import { CaptionPlayerPreview } from "@/components/CaptionPlayerPreview";
import { DocumentationHub } from "@/components/DocumentationHub";
import { ToolkitPanels } from "@/components/ToolkitPanels";
import { SignToolsPreview } from "@/components/SignToolsPreview";
import "@/App.css";

const packageCards = [
  {
    icon: <Captions size={24} />,
    title: "caption-player",
    description: "HTML5 video, WebVTT support, large captions, and transcript click-to-seek.",
  },
  {
    icon: <VolumeX size={24} />,
    title: "deaf-ui",
    description: "Visual alerts, caption cards, step-by-step guidance, and countdown feedback.",
  },
  {
    icon: <HandMetal size={24} />,
    title: "isl-tools",
    description: "Looped practice, slow playback, and sign-friendly card layouts for ISL learning.",
  },
];

const docsCards = [
  { title: "README", description: "Installation, package overview, and usage examples for developers." },
  { title: "Docs", description: "Accessibility mission, getting started, and component guidance." },
  { title: "Contributing", description: "Deaf-first contribution principles and review prompts." },
];

function App() {
  return (
    <main className="toolkit-app" data-testid="toolkit-app-shell">
      <section className="hero-shell" data-testid="hero-section">
        <div className="hero-copy" data-testid="hero-copy-block">
          <p className="eyebrow" data-testid="hero-eyebrow">UpliftiQ Accessibility Toolkit</p>
          <h1 data-testid="hero-title">Developer tools for Deaf-friendly learning platforms.</h1>
          <p className="hero-lead" data-testid="hero-description">
            Build lessons where captions stay readable, alerts stay visible, and sign-ready media patterns feel natural from the first interaction.
          </p>
          <div className="hero-actions" data-testid="hero-actions">
            <a href="#live-demo" className="action-button hero-link" data-testid="hero-live-demo-link">
              Explore live demo
              <ArrowRight size={18} />
            </a>
            <a href="#documentation" className="action-button action-button--secondary hero-link" data-testid="hero-docs-link">
              Read toolkit docs
            </a>
          </div>
        </div>

        <div className="hero-aside" data-testid="hero-aside-panel">
          <div className="hero-stat-card" data-testid="hero-stat-captions-card">
            <Captions size={20} />
            <div>
              <p className="hero-stat-label" data-testid="hero-stat-captions-label">Caption-first lessons</p>
              <p className="hero-stat-value" data-testid="hero-stat-captions-value">Readable, synced, clickable</p>
            </div>
          </div>
          <div className="hero-stat-card" data-testid="hero-stat-visual-card">
            <VolumeX size={20} />
            <div>
              <p className="hero-stat-label" data-testid="hero-stat-visual-label">Sound-free cues</p>
              <p className="hero-stat-value" data-testid="hero-stat-visual-value">Alerts, timers, and task states</p>
            </div>
          </div>
          <div className="hero-stat-card" data-testid="hero-stat-sign-card">
            <HandMetal size={20} />
            <div>
              <p className="hero-stat-label" data-testid="hero-stat-sign-label">ISL-ready playback</p>
              <p className="hero-stat-value" data-testid="hero-stat-sign-value">Loop and slow-mode practice</p>
            </div>
          </div>
        </div>
      </section>

      <section className="packages-section" data-testid="packages-section">
        <div className="section-heading-block" data-testid="packages-heading-block">
          <p className="eyebrow" data-testid="packages-eyebrow">Monorepo structure</p>
          <h2 data-testid="packages-title">Three focused packages plus a demo learning platform</h2>
        </div>
        <div className="packages-grid" data-testid="packages-grid">
          {packageCards.map((item) => (
            <article className="package-card" key={item.title} data-testid={`package-card-${item.title}`}>
              <div className="package-card__icon" data-testid={`package-card-icon-${item.title}`}>{item.icon}</div>
              <h3 data-testid={`package-card-title-${item.title}`}>{item.title}</h3>
              <p data-testid={`package-card-description-${item.title}`}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="install-section" data-testid="install-section">
        <div className="section-heading-block" data-testid="install-heading-block">
          <p className="eyebrow" data-testid="install-eyebrow">Developer-friendly setup</p>
          <h2 data-testid="install-title">Install with npm and start composing accessible learning flows</h2>
        </div>
        <div className="install-panel" data-testid="install-panel">
          <div className="install-copy" data-testid="install-copy-block">
            <BookOpenText size={24} />
            <p data-testid="install-copy-text">Use the packages independently or together inside your own education product.</p>
          </div>
          <pre className="install-code" data-testid="install-command">npm install @upliftiq/caption-player @upliftiq/deaf-ui @upliftiq/isl-tools</pre>
        </div>
      </section>

      <section id="live-demo" className="live-demo-section" data-testid="live-demo-section">
        <CaptionPlayerPreview />
        <ToolkitPanels />
        <SignToolsPreview />
      </section>

      <section id="documentation" className="documentation-section" data-testid="documentation-section">
        <div className="section-heading-block" data-testid="documentation-heading-block">
          <p className="eyebrow" data-testid="documentation-eyebrow">Documentation bundle</p>
          <h2 data-testid="documentation-title">Guidance for teams building accessible education products</h2>
        </div>
        <div className="docs-grid" data-testid="documentation-grid">
          {docsCards.map((item) => (
            <article className="doc-card" key={item.title} data-testid={`documentation-card-${item.title.toLowerCase()}`}>
              <h3 data-testid={`documentation-card-title-${item.title.toLowerCase()}`}>{item.title}</h3>
              <p data-testid={`documentation-card-description-${item.title.toLowerCase()}`}>{item.description}</p>
            </article>
          ))}
        </div>
        <DocumentationHub />
      </section>
    </main>
  );
}

export default App;
