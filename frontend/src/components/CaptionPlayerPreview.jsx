import { useEffect, useMemo, useRef, useState } from "react";
import { parseVtt } from "@/utils/parseVtt";

const LESSON_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const SIGN_OVERLAY_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const CAPTION_TRACKS = [
  { src: "/captions/demo-lesson.vtt", srclang: "en", label: "English", default: true },
  { src: "/captions/demo-lesson-hi.vtt", srclang: "hi", label: "Hindi" },
];

const CAPTION_SIZES = [
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "XL" },
];

const CAPTION_THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "contrast", label: "High contrast" },
];

const CAPTION_SPACING = [
  { value: "compact", label: "Compact" },
  { value: "relaxed", label: "Relaxed" },
];

const PANEL_STYLES = [
  { value: "card", label: "Card" },
  { value: "banner", label: "Banner" },
];

const OVERLAY_MODES = [
  { value: "off", label: "Off" },
  { value: "pip", label: "PiP" },
  { value: "split", label: "Split" },
];

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text, query) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const matcher = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "ig");
  return text.split(matcher).map((part, index) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="caption-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
};

const cycleValue = (values, current) => values[(values.indexOf(current) + 1) % values.length];

export const CaptionPlayerPreview = () => {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const signVideoRef = useRef(null);
  const searchInputRef = useRef(null);
  const transcriptButtonRefs = useRef({});
  const [cues, setCues] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [captionError, setCaptionError] = useState(null);
  const [captionSize, setCaptionSize] = useState("large");
  const [captionTheme, setCaptionTheme] = useState("dark");
  const [captionSpacing, setCaptionSpacing] = useState("relaxed");
  const [panelStyle, setPanelStyle] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [overlayMode, setOverlayMode] = useState("pip");
  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState("en");
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const selectedTrack = useMemo(
    () => CAPTION_TRACKS.find((track) => track.srclang === selectedCaptionLanguage) || CAPTION_TRACKS[0],
    [selectedCaptionLanguage],
  );
  const effectiveCaptionSize = accessibilityMode ? "xlarge" : captionSize;
  const effectiveCaptionTheme = accessibilityMode ? "contrast" : captionTheme;
  const effectiveCaptionSpacing = accessibilityMode ? "relaxed" : captionSpacing;
  const effectivePanelStyle = accessibilityMode ? "banner" : panelStyle;
  const effectiveOverlayMode = accessibilityMode ? "split" : overlayMode;

  useEffect(() => {
    let isMounted = true;

    fetch(selectedTrack.src)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Captions could not be loaded for this lesson.");
        }
        return response.text();
      })
      .then((text) => {
        const parsedCues = parseVtt(text);
        if (!parsedCues.length) {
          throw new Error("No readable caption cues were found.");
        }
        if (!isMounted) return;
        setCaptionError(null);
        setCues(parsedCues);
        setActiveIndex(0);
      })
      .catch((error) => {
        if (!isMounted) return;
        setCues([]);
        setCaptionError(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTrack]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return undefined;

    const handleTimeUpdate = () => {
      const nextIndex = cues.findIndex((cue) => element.currentTime >= cue.start && element.currentTime <= cue.end);
      if (nextIndex >= 0) setActiveIndex(nextIndex);
    };

    element.addEventListener("timeupdate", handleTimeUpdate);
    return () => element.removeEventListener("timeupdate", handleTimeUpdate);
  }, [cues]);

  useEffect(() => {
    const mainVideo = videoRef.current;
    const signVideo = signVideoRef.current;
    if (!mainVideo || !signVideo || effectiveOverlayMode === "off") return undefined;

    const syncTime = () => {
      if (Math.abs(signVideo.currentTime - mainVideo.currentTime) > 0.35) {
        signVideo.currentTime = mainVideo.currentTime;
      }
    };

    const syncPlay = () => {
      signVideo.playbackRate = mainVideo.playbackRate;
      signVideo.play().catch(() => {});
    };

    const syncPause = () => signVideo.pause();
    const syncRate = () => {
      signVideo.playbackRate = mainVideo.playbackRate;
    };
    const syncSeek = () => {
      signVideo.currentTime = mainVideo.currentTime;
    };

    signVideo.currentTime = mainVideo.currentTime;
    signVideo.playbackRate = mainVideo.playbackRate;

    mainVideo.addEventListener("play", syncPlay);
    mainVideo.addEventListener("pause", syncPause);
    mainVideo.addEventListener("ratechange", syncRate);
    mainVideo.addEventListener("seeking", syncSeek);
    mainVideo.addEventListener("timeupdate", syncTime);

    return () => {
      mainVideo.removeEventListener("play", syncPlay);
      mainVideo.removeEventListener("pause", syncPause);
      mainVideo.removeEventListener("ratechange", syncRate);
      mainVideo.removeEventListener("seeking", syncSeek);
      mainVideo.removeEventListener("timeupdate", syncTime);
    };
  }, [effectiveOverlayMode]);

  const activeCue = useMemo(() => cues[activeIndex], [activeIndex, cues]);
  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const filteredCues = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return cues;

    return cues.filter((cue) => {
      const normalizedText = cue.text.toLowerCase();
      const normalizedTime = formatTime(cue.start).toLowerCase();
      return normalizedText.includes(trimmedQuery) || normalizedTime.includes(trimmedQuery);
    });
  }, [cues, searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim() || !filteredCues.length) return;
    const activeCueId = cues[activeIndex]?.id;
    const activeCueVisible = filteredCues.some((cue) => cue.id === activeCueId);
    if (!activeCueVisible) {
      const nextIndex = cues.findIndex((cue) => cue.id === filteredCues[0].id);
      if (nextIndex >= 0) setActiveIndex(nextIndex);
    }
  }, [activeIndex, cues, filteredCues, searchQuery]);

  useEffect(() => {
    const activeCueId = cues[activeIndex]?.id;
    if (!activeCueId) return;
    transcriptButtonRefs.current[activeCueId]?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeIndex, cues, prefersReducedMotion]);

  const jumpToCue = (cue) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = cue.start;
    videoRef.current.play().catch(() => {});
  };

  const moveSelection = (direction) => {
    if (!filteredCues.length) return;
    const activeCueId = cues[activeIndex]?.id;
    const currentVisibleIndex = filteredCues.findIndex((cue) => cue.id === activeCueId);
    const safeIndex = currentVisibleIndex >= 0 ? currentVisibleIndex : 0;
    const nextVisibleIndex = Math.min(Math.max(safeIndex + direction, 0), filteredCues.length - 1);
    const nextCue = filteredCues[nextVisibleIndex];
    const nextIndex = cues.findIndex((cue) => cue.id === nextCue.id);
    if (nextIndex >= 0) setActiveIndex(nextIndex);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      return;
    }
    videoRef.current.pause();
  };

  const seekBy = (seconds) => {
    if (!videoRef.current) return;
    const duration = Number.isFinite(videoRef.current.duration)
      ? videoRef.current.duration
      : videoRef.current.currentTime + Math.abs(seconds);
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
  };

  const handleRootKeyDown = (event) => {
    const isRootShortcutContext = event.target === event.currentTarget || event.target.tagName === "VIDEO";
    if (!isRootShortcutContext) return;

    switch (event.key) {
      case "/":
        event.preventDefault();
        searchInputRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        moveSelection(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveSelection(-1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        seekBy(-5);
        break;
      case "ArrowRight":
        event.preventDefault();
        seekBy(5);
        break;
      case "Enter": {
        const cueToPlay = filteredCues.find((cue) => cue.id === cues[activeIndex]?.id) || filteredCues[0];
        if (cueToPlay) {
          event.preventDefault();
          jumpToCue(cueToPlay);
        }
        break;
      }
      case " ":
        event.preventDefault();
        togglePlayback();
        break;
      case "+":
      case "=":
        event.preventDefault();
        setCaptionSize((current) => cycleValue(CAPTION_SIZES.map((item) => item.value), current));
        break;
      case "-":
      case "_":
        event.preventDefault();
        setCaptionSize((current) => cycleValue([...CAPTION_SIZES.map((item) => item.value)].reverse(), current));
        break;
      case "t":
      case "T":
        event.preventDefault();
        setCaptionTheme((current) => cycleValue(CAPTION_THEMES.map((item) => item.value), current));
        break;
      case "o":
      case "O":
        event.preventDefault();
        setOverlayMode((current) => cycleValue(OVERLAY_MODES.map((item) => item.value), current));
        break;
      case "a":
      case "A":
        event.preventDefault();
        setAccessibilityMode((current) => !current);
        break;
      case "l":
      case "L":
        event.preventDefault();
        setSelectedCaptionLanguage((current) => cycleValue(CAPTION_TRACKS.map((track) => track.srclang), current));
        break;
      case "Escape":
        if (searchQuery) {
          event.preventDefault();
          setSearchQuery("");
        }
        break;
      default:
    }
  };

  const renderOverlay = (variant) => (
    <div
      className={`caption-player__sign-overlay ${variant === "pip" ? "caption-player__sign-overlay--pip" : "caption-player__sign-overlay--split"}`}
      data-testid={`caption-overlay-${variant}`}
    >
      <div className="caption-player__sign-header">
        <div>
          <p className="eyebrow" data-testid={`caption-overlay-${variant}-eyebrow`}>Sign-language overlay</p>
          <p className="caption-player__sign-copy" data-testid={`caption-overlay-${variant}-copy`}>ISL-friendly support can stay docked or expand into split-view.</p>
        </div>
      </div>
      <video
        ref={signVideoRef}
        className="caption-player__sign-video"
        muted
        playsInline
        controls={variant === "split"}
        preload="metadata"
        data-testid="caption-overlay-video"
      >
        <source src={SIGN_OVERLAY_VIDEO_URL} type="video/mp4" />
      </video>
    </div>
  );

  return (
    <section
      ref={rootRef}
      className={`caption-player caption-player--${effectiveCaptionTheme} caption-player--${effectiveCaptionSize} caption-player--${effectiveCaptionSpacing} caption-player--${effectivePanelStyle} ${accessibilityMode ? "caption-player--accessibility" : ""}`}
      data-testid="caption-player-section"
      tabIndex={0}
      onKeyDown={handleRootKeyDown}
    >
      <div className="caption-player__video-column">
        <div className="section-heading-block" data-testid="caption-player-heading-block">
          <p className="eyebrow" data-testid="caption-player-eyebrow">Caption Player</p>
          <h2 data-testid="caption-player-title">Multi-language WebVTT playback with Accessibility Mode and sign overlay support</h2>
        </div>

        <div className={`caption-player__stage ${effectiveOverlayMode === "split" ? "caption-player__stage--split" : ""}`} data-testid="caption-player-stage">
          <div className="caption-player__video-shell" data-testid="caption-player-video-shell">
            <video ref={videoRef} className="caption-player__video" controls preload="metadata" data-testid="caption-player-video">
              <source src={LESSON_VIDEO_URL} type="video/mp4" />
              {CAPTION_TRACKS.map((track) => (
                <track
                  key={track.srclang}
                  kind="subtitles"
                  src={track.src}
                  srcLang={track.srclang}
                  label={track.label}
                  default={track.srclang === selectedCaptionLanguage}
                />
              ))}
            </video>
            {effectiveOverlayMode === "pip" ? renderOverlay("pip") : null}
          </div>
          {effectiveOverlayMode === "split" ? renderOverlay("split") : null}
        </div>

        <div className={`caption-controls ${accessibilityMode ? "caption-controls--simplified" : ""}`} data-testid="caption-controls-panel">
          <div className="caption-mode-row" data-testid="caption-accessibility-mode-panel">
            <button
              type="button"
              className={`caption-mode-button ${accessibilityMode ? "caption-mode-button--active" : ""}`}
              onClick={() => setAccessibilityMode((current) => !current)}
              aria-pressed={accessibilityMode}
              data-testid="caption-accessibility-mode-button"
            >
              Accessibility Mode: {accessibilityMode ? "ON" : "OFF"}
            </button>
            <p className="caption-mode-summary" data-testid="caption-accessibility-mode-summary">
              {accessibilityMode
                ? "XL captions, high contrast, an expanded transcript, and split sign overlay are enabled."
                : "Use individual controls or enable Accessibility Mode for the full optimized layout."}
            </p>
          </div>

          <div className="caption-controls__search" data-testid="caption-search-panel">
            <label htmlFor="caption-search-input" className="caption-controls__label">Search captions</label>
            <div className="caption-controls__search-row">
              <input
                ref={searchInputRef}
                id="caption-search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="caption-controls__search-input"
                placeholder="Search words or time"
                data-testid="caption-search-input"
              />
              <button type="button" className="caption-controls__clear" onClick={() => setSearchQuery("")} data-testid="caption-search-clear-button">
                Clear
              </button>
            </div>
            <p className="caption-controls__meta" data-testid="caption-search-results-meta" aria-live="polite">
              {filteredCues.length} matching caption{filteredCues.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="caption-controls__grid" data-testid="caption-control-groups">
            <fieldset className="caption-controls__group" data-testid="caption-language-group">
              <legend className="caption-controls__label">Caption language</legend>
              <div className="caption-controls__options">
                {CAPTION_TRACKS.map((track) => (
                  <button
                    key={track.srclang}
                    type="button"
                    className={`caption-controls__option ${selectedCaptionLanguage === track.srclang ? "caption-controls__option--active" : ""}`}
                    aria-pressed={selectedCaptionLanguage === track.srclang}
                    onClick={() => setSelectedCaptionLanguage(track.srclang)}
                    data-testid={`caption-language-${track.srclang}-button`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {!accessibilityMode ? (
              <>
                <fieldset className="caption-controls__group" data-testid="caption-size-group">
                  <legend className="caption-controls__label">Caption size</legend>
                  <div className="caption-controls__options">
                    {CAPTION_SIZES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`caption-controls__option ${effectiveCaptionSize === option.value ? "caption-controls__option--active" : ""}`}
                        aria-pressed={effectiveCaptionSize === option.value}
                        onClick={() => setCaptionSize(option.value)}
                        data-testid={`caption-size-${option.value}-button`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="caption-controls__group" data-testid="caption-theme-group">
                  <legend className="caption-controls__label">Theme</legend>
                  <div className="caption-controls__options">
                    {CAPTION_THEMES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`caption-controls__option ${effectiveCaptionTheme === option.value ? "caption-controls__option--active" : ""}`}
                        aria-pressed={effectiveCaptionTheme === option.value}
                        onClick={() => setCaptionTheme(option.value)}
                        data-testid={`caption-theme-${option.value}-button`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="caption-controls__group" data-testid="caption-spacing-group">
                  <legend className="caption-controls__label">Line spacing</legend>
                  <div className="caption-controls__options">
                    {CAPTION_SPACING.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`caption-controls__option ${effectiveCaptionSpacing === option.value ? "caption-controls__option--active" : ""}`}
                        aria-pressed={effectiveCaptionSpacing === option.value}
                        onClick={() => setCaptionSpacing(option.value)}
                        data-testid={`caption-spacing-${option.value}-button`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="caption-controls__group" data-testid="caption-panel-style-group">
                  <legend className="caption-controls__label">Caption panel</legend>
                  <div className="caption-controls__options">
                    {PANEL_STYLES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`caption-controls__option ${effectivePanelStyle === option.value ? "caption-controls__option--active" : ""}`}
                        aria-pressed={effectivePanelStyle === option.value}
                        onClick={() => setPanelStyle(option.value)}
                        data-testid={`caption-panel-${option.value}-button`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            ) : null}

            <fieldset className="caption-controls__group" data-testid="caption-overlay-group">
              <legend className="caption-controls__label">Sign overlay</legend>
              <div className="caption-controls__options">
                {OVERLAY_MODES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`caption-controls__option ${effectiveOverlayMode === option.value ? "caption-controls__option--active" : ""}`}
                    aria-pressed={effectiveOverlayMode === option.value}
                    onClick={() => setOverlayMode(option.value)}
                    data-testid={`caption-overlay-${option.value}-button`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <p className="caption-shortcuts" data-testid="caption-keyboard-help">
            Keyboard shortcuts: / search, ↑ and ↓ browse transcript, ← and → seek, Enter jump, Space play or pause, + or - adjust size, T change theme, L switch language, O toggle sign overlay, A toggle Accessibility Mode.
          </p>
        </div>

        <div className="caption-surface" aria-live="polite" data-testid="caption-live-surface">
          <span className="eyebrow eyebrow--light" data-testid="caption-live-label">Live caption · {selectedTrack.label}</span>
          <p className="caption-surface__text" data-testid="caption-live-text">
            {captionError || (activeCue ? highlightText(activeCue.text, searchQuery) : "Captions will appear here as the lesson plays.")}
          </p>
        </div>
      </div>

      <aside className={`caption-transcript ${accessibilityMode ? "caption-transcript--expanded" : ""}`} data-testid="caption-transcript-panel">
        <div className="section-heading-block" data-testid="caption-transcript-heading-block">
          <p className="eyebrow" data-testid="caption-transcript-eyebrow">Transcript panel</p>
          <h3 data-testid="caption-transcript-title">Jump to any moment with one click · {selectedTrack.label}</h3>
        </div>
        <div className="caption-transcript__list" data-testid="caption-transcript-list">
          {captionError ? (
            <div className="caption-error" data-testid="caption-error-message">{captionError}</div>
          ) : !filteredCues.length ? (
            <div className="caption-empty" data-testid="caption-empty-message">No captions match your search yet.</div>
          ) : (
            filteredCues.map((cue, index) => {
              const cueIndex = cues.findIndex((item) => item.id === cue.id);
              return (
                <button
                  key={cue.id}
                  type="button"
                  ref={(node) => {
                    transcriptButtonRefs.current[cue.id] = node;
                  }}
                  className={`transcript-line ${cueIndex === activeIndex ? "transcript-line--active" : ""}`}
                  onClick={() => jumpToCue(cue)}
                  data-testid={`transcript-line-${index + 1}`}
                  aria-current={cueIndex === activeIndex ? "true" : undefined}
                >
                  <span className="transcript-line__time" data-testid={`transcript-line-time-${index + 1}`}>{formatTime(cue.start)}</span>
                  <span className="transcript-line__text" data-testid={`transcript-line-text-${index + 1}`}>{highlightText(cue.text, searchQuery)}</span>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </section>
  );
};
