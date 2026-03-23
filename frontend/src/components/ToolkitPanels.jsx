import { useEffect, useMemo, useState } from "react";

const STEPS = [
  { step: "Step 1", title: "Preview the concept", description: "Give learners a clear text summary before motion begins." },
  { step: "Step 2", title: "Watch the captioned lesson", description: "Keep captions outside the video for stronger readability." },
  { step: "Step 3", title: "Practice visually", description: "Reinforce with visual timers, cards, and sign-ready repetition." },
];

export const ToolkitPanels = () => {
  const [remaining, setRemaining] = useState(90);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const progress = useMemo(() => (remaining / 90) * 100, [remaining]);
  const timerTone = progress > 60 ? "timer-fill--success" : progress > 25 ? "timer-fill--warning" : "timer-fill--error";

  return (
    <section className="toolkit-grid" data-testid="toolkit-grid-section">
      <article className="signal-card signal-card--info" data-testid="visual-alert-card">
        <div className="signal-card__icon" data-testid="visual-alert-icon">◎</div>
        <div>
          <p className="eyebrow" data-testid="visual-alert-eyebrow">VisualAlert</p>
          <h3 data-testid="visual-alert-title">A sound-free notice that still feels urgent</h3>
          <p data-testid="visual-alert-message">Use contrast, iconography, and motion-aware emphasis instead of relying on beeps.</p>
        </div>
      </article>

      <article className="content-card" data-testid="caption-card-example">
        <p className="eyebrow" data-testid="caption-card-eyebrow">CaptionCard</p>
        <h3 data-testid="caption-card-title">Key lesson summary</h3>
        <p data-testid="caption-card-text">Captions become more effective when they work with transcript navigation and visual reinforcement.</p>
      </article>

      <article className="content-card" data-testid="visual-timer-card">
        <div className="timer-header">
          <div>
            <p className="eyebrow" data-testid="visual-timer-eyebrow">VisualTimer</p>
            <h3 data-testid="visual-timer-title">Guided practice countdown</h3>
          </div>
          <p className="timer-value" data-testid="visual-timer-value">{remaining}s</p>
        </div>
        <div className="timer-track" data-testid="visual-timer-track">
          <div className={`timer-fill ${timerTone}`} style={{ width: `${progress}%` }} data-testid="visual-timer-fill" />
        </div>
        <button type="button" className="action-button action-button--secondary" onClick={() => setRemaining(90)} data-testid="visual-timer-reset-button">
          Reset timer
        </button>
      </article>

      <article className="step-stack" data-testid="step-learning-card-list">
        <p className="eyebrow" data-testid="step-learning-eyebrow">StepLearningCard</p>
        {STEPS.map((item) => (
          <div className="step-card" key={item.step} data-testid={`step-learning-card-${item.step.toLowerCase().replace(/\s+/g, "-")}`}>
            <span className="step-badge" data-testid={`step-learning-badge-${item.step.toLowerCase().replace(/\s+/g, "-")}`}>{item.step}</span>
            <div>
              <h3 data-testid={`step-learning-title-${item.step.toLowerCase().replace(/\s+/g, "-")}`}>{item.title}</h3>
              <p data-testid={`step-learning-description-${item.step.toLowerCase().replace(/\s+/g, "-")}`}>{item.description}</p>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};
