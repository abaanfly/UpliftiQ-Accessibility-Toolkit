import { useEffect, useRef, useState } from "react";

const SIGN_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const WORDS = ["Hello", "Learn", "Together"];

export const SignToolsPreview = () => {
  const videoRef = useRef(null);
  const [slowMode, setSlowMode] = useState(false);
  const [loopMode, setLoopMode] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = slowMode ? 0.65 : 1;
    videoRef.current.loop = loopMode;
  }, [loopMode, slowMode]);

  return (
    <section className="sign-layout" data-testid="sign-tools-section">
      <div className="sign-player" data-testid="sign-video-player-card">
        <div className="section-heading-block" data-testid="sign-video-heading-block">
          <p className="eyebrow" data-testid="sign-video-eyebrow">SignVideoPlayer</p>
          <h2 data-testid="sign-video-title">Slow playback and looping for sign practice</h2>
        </div>
        <video ref={videoRef} className="sign-player__video" controls muted data-testid="sign-video-element">
          <source src={SIGN_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="sign-player__actions" data-testid="sign-video-actions">
          <button type="button" className="action-button" onClick={() => setSlowMode((value) => !value)} data-testid="sign-video-slow-toggle-button">
            {slowMode ? "Normal speed" : "Slow motion"}
          </button>
          <button type="button" className="action-button action-button--secondary" onClick={() => setLoopMode((value) => !value)} data-testid="sign-video-loop-toggle-button">
            {loopMode ? "Loop on" : "Loop off"}
          </button>
        </div>
      </div>

      <div className="sign-card-list" data-testid="sign-card-list">
        {WORDS.map((word) => (
          <article className="sign-card" key={word} data-testid={`sign-card-${word.toLowerCase()}`}>
            <div>
              <p className="eyebrow" data-testid={`sign-card-eyebrow-${word.toLowerCase()}`}>SignCard</p>
              <h3 data-testid={`sign-card-word-${word.toLowerCase()}`}>{word}</h3>
              <p data-testid={`sign-card-description-${word.toLowerCase()}`}>Pair a focus word with repeatable motion so learners can review at their own pace.</p>
            </div>
            <div className="sign-card__mini-video" data-testid={`sign-card-video-${word.toLowerCase()}`}>Loop-ready practice clip</div>
          </article>
        ))}
      </div>
    </section>
  );
};
