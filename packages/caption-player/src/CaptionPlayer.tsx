import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./CaptionPlayer.module.css";
import { parseWebVtt, type CaptionCue } from "./parseWebVtt";

type CaptionSize = "medium" | "large" | "xlarge";
type CaptionTheme = "dark" | "light" | "contrast";
type CaptionSpacing = "compact" | "relaxed";
type CaptionPanelStyle = "card" | "banner";
type OverlayMode = "off" | "pip" | "split";

export interface CaptionTrack {
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
}

const CAPTION_SIZES: { value: CaptionSize; label: string }[] = [
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "XL" },
];

const CAPTION_THEMES: { value: CaptionTheme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "contrast", label: "High contrast" },
];

const CAPTION_SPACING: { value: CaptionSpacing; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "relaxed", label: "Relaxed" },
];

const PANEL_STYLES: { value: CaptionPanelStyle; label: string }[] = [
  { value: "card", label: "Card" },
  { value: "banner", label: "Banner" },
];

const OVERLAY_MODES: { value: OverlayMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "pip", label: "PiP" },
  { value: "split", label: "Split" },
];

export interface CaptionPlayerProps {
  video: string;
  captions: string | CaptionTrack[];
  title?: string;
  transcriptTitle?: string;
  signOverlayVideo?: string;
  signOverlayLabel?: string;
  defaultOverlayMode?: OverlayMode;
  defaultCaptionLanguage?: string;
}

export type { CaptionCue };

const themeClassMap: Record<CaptionTheme, string> = {
  dark: styles.themeDark,
  light: styles.themeLight,
  contrast: styles.themeContrast,
};

const sizeClassMap: Record<CaptionSize, string> = {
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
  xlarge: styles.sizeXLarge,
};

const spacingClassMap: Record<CaptionSpacing, string> = {
  compact: styles.spacingCompact,
  relaxed: styles.spacingRelaxed,
};

const panelStyleClassMap: Record<CaptionPanelStyle, string> = {
  card: styles.styleCard,
  banner: styles.styleBanner,
};

const cycleValue = <T extends string>(values: T[], current: T) => {
  const currentIndex = values.indexOf(current);
  return values[(currentIndex + 1) % values.length];
};

const normalizeCaptionTracks = (captions: string | CaptionTrack[]): CaptionTrack[] => {
  if (typeof captions === "string") {
    return [{ src: captions, srclang: "en", label: "English", default: true }];
  }

  return captions.length ? captions : [{ src: "", srclang: "en", label: "English", default: true }];
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, query: string, highlightClass: string): ReactNode => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const matcher = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "ig");
  return text.split(matcher).map((part, index) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark key={`${part}-${index}`} className={highlightClass}>
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
};

export function CaptionPlayer({
  video,
  captions,
  title = "Captioned lesson",
  transcriptTitle = "Transcript",
  signOverlayVideo,
  signOverlayLabel = "Sign-language support",
  defaultOverlayMode = "pip",
  defaultCaptionLanguage,
}: CaptionPlayerProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const signVideoRef = useRef<HTMLVideoElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const transcriptButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const captionTracks = useMemo(() => normalizeCaptionTracks(captions), [captions]);
  const initialLanguage = useMemo(
    () => defaultCaptionLanguage ?? captionTracks.find((track) => track.default)?.srclang ?? captionTracks[0]?.srclang ?? "en",
    [captionTracks, defaultCaptionLanguage],
  );
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [captionSize, setCaptionSize] = useState<CaptionSize>("large");
  const [captionTheme, setCaptionTheme] = useState<CaptionTheme>("dark");
  const [captionSpacing, setCaptionSpacing] = useState<CaptionSpacing>("relaxed");
  const [panelStyle, setPanelStyle] = useState<CaptionPanelStyle>("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [overlayMode, setOverlayMode] = useState<OverlayMode>(signOverlayVideo ? defaultOverlayMode : "off");
  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState(initialLanguage);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const selectedTrack = useMemo(
    () => captionTracks.find((track) => track.srclang === selectedCaptionLanguage) ?? captionTracks[0],
    [captionTracks, selectedCaptionLanguage],
  );
  const effectiveCaptionSize = accessibilityMode ? "xlarge" : captionSize;
  const effectiveCaptionTheme = accessibilityMode ? "contrast" : captionTheme;
  const effectiveCaptionSpacing = accessibilityMode ? "relaxed" : captionSpacing;
  const effectivePanelStyle = accessibilityMode ? "banner" : panelStyle;
  const effectiveOverlayMode = accessibilityMode && signOverlayVideo ? "split" : overlayMode;

  useEffect(() => {
    setSelectedCaptionLanguage(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    let isMounted = true;

    if (!selectedTrack?.src) {
      setCaptionError("A caption file is required.");
      setCues([]);
      return () => {
        isMounted = false;
      };
    }

    fetch(selectedTrack.src)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Captions could not be loaded.");
        }
        return response.text();
      })
      .then((text) => {
        const parsedCues = parseWebVtt(text);
        if (!parsedCues.length) {
          throw new Error("No valid caption cues were found in the WebVTT file.");
        }
        if (!isMounted) return;
        setCaptionError(null);
        setCues(parsedCues);
        setActiveIndex(0);
      })
      .catch((error: Error) => {
        if (!isMounted) return;
        setCues([]);
        setCaptionError(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTrack]);

  useEffect(() => {
    if (!signOverlayVideo) {
      setOverlayMode("off");
    }
  }, [signOverlayVideo]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const syncCue = () => {
      const nextIndex = cues.findIndex(
        (cue) => videoElement.currentTime >= cue.start && videoElement.currentTime <= cue.end,
      );
      if (nextIndex >= 0) setActiveIndex(nextIndex);
    };

    videoElement.addEventListener("timeupdate", syncCue);
    return () => videoElement.removeEventListener("timeupdate", syncCue);
  }, [cues]);

  useEffect(() => {
    const mainVideo = videoRef.current;
    const signVideo = signVideoRef.current;

    if (!mainVideo || !signVideo || !signOverlayVideo || effectiveOverlayMode === "off") return;

    const syncTime = () => {
      if (Math.abs(signVideo.currentTime - mainVideo.currentTime) > 0.35) {
        signVideo.currentTime = mainVideo.currentTime;
      }
    };

    const syncPlay = () => {
      signVideo.playbackRate = mainVideo.playbackRate;
      void signVideo.play().catch(() => undefined);
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
  }, [effectiveOverlayMode, signOverlayVideo]);

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

  const jumpToCue = (cue: CaptionCue) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = cue.start;
    void videoRef.current.play();
  };

  const moveSelection = (direction: 1 | -1) => {
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
      void videoRef.current.play().catch(() => undefined);
      return;
    }
    videoRef.current.pause();
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const duration = Number.isFinite(videoRef.current.duration) ? videoRef.current.duration : videoRef.current.currentTime + Math.abs(seconds);
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
  };

  const handleRootKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const isRootShortcutContext = target === event.currentTarget || target.tagName === "VIDEO";
    if (!isRootShortcutContext) return;

    switch (event.key) {
      case "/":
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      case "ArrowDown":
        event.preventDefault();
        moveSelection(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        moveSelection(-1);
        return;
      case "ArrowLeft":
        event.preventDefault();
        seekBy(-5);
        return;
      case "ArrowRight":
        event.preventDefault();
        seekBy(5);
        return;
      case "Enter":
        if (filteredCues.length) {
          event.preventDefault();
          const cueToPlay = filteredCues.find((cue) => cue.id === cues[activeIndex]?.id) ?? filteredCues[0];
          jumpToCue(cueToPlay);
        }
        return;
      case " ":
        event.preventDefault();
        togglePlayback();
        return;
      case "+":
      case "=":
        event.preventDefault();
        setCaptionSize((current) => cycleValue(CAPTION_SIZES.map((item) => item.value), current));
        return;
      case "-":
      case "_":
        event.preventDefault();
        setCaptionSize((current) => cycleValue([...CAPTION_SIZES.map((item) => item.value)].reverse(), current));
        return;
      case "t":
      case "T":
        event.preventDefault();
        setCaptionTheme((current) => cycleValue(CAPTION_THEMES.map((item) => item.value), current));
        return;
      case "o":
      case "O":
        if (signOverlayVideo) {
          event.preventDefault();
          setOverlayMode((current) => cycleValue(OVERLAY_MODES.map((item) => item.value), current));
        }
        return;
      case "a":
      case "A":
        event.preventDefault();
        setAccessibilityMode((current) => !current);
        return;
      case "l":
      case "L":
        event.preventDefault();
        setSelectedCaptionLanguage((current) => cycleValue(captionTracks.map((track) => track.srclang), current));
        return;
      case "Escape":
        if (searchQuery) {
          event.preventDefault();
          setSearchQuery("");
        }
        return;
      default:
    }
  };

  const renderSignOverlay = (variant: "pip" | "split") => {
    if (!signOverlayVideo) return null;

    return (
      <div
        className={`${styles.signOverlay} ${variant === "pip" ? styles.pipOverlay : styles.splitOverlay}`}
        data-testid={`caption-player-sign-overlay-${variant}`}
      >
        <div className={styles.signHeader}>
          <div>
            <p className={styles.timestamp}>Sign-language overlay</p>
            <p className={styles.overlayCopy}>{signOverlayLabel}</p>
          </div>
        </div>
        <video
          ref={signVideoRef}
          className={styles.signVideo}
          muted
          playsInline
          controls={variant === "split"}
          preload="metadata"
          data-testid="caption-player-sign-overlay-video"
        >
          <source src={signOverlayVideo} type="video/mp4" />
        </video>
      </div>
    );
  };

  return (
    <section
      ref={rootRef}
      className={`${styles.player} ${themeClassMap[effectiveCaptionTheme]} ${sizeClassMap[effectiveCaptionSize]} ${spacingClassMap[effectiveCaptionSpacing]} ${panelStyleClassMap[effectivePanelStyle]} ${accessibilityMode ? styles.accessibilityModeOn : ""}`}
      aria-label={title}
      data-testid="caption-player-root"
      tabIndex={0}
      onKeyDown={handleRootKeyDown}
    >
      <div className={styles.mediaColumn}>
        <div className={`${styles.videoStage} ${effectiveOverlayMode === "split" ? styles.splitStage : ""}`}>
          <div className={styles.videoShell}>
            <video ref={videoRef} className={styles.video} controls preload="metadata" data-testid="caption-player-video">
              <source src={video} type="video/mp4" />
              {captionTracks.map((track) => (
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
            {signOverlayVideo && effectiveOverlayMode === "pip" ? renderSignOverlay("pip") : null}
          </div>
          {signOverlayVideo && effectiveOverlayMode === "split" ? renderSignOverlay("split") : null}
        </div>
        <div className={`${styles.controlsPanel} ${accessibilityMode ? styles.controlsPanelSimplified : ""}`} data-testid="caption-player-controls-panel">
          <div className={styles.modeRow}>
            <button
              type="button"
              className={`${styles.modeButton} ${accessibilityMode ? styles.modeButtonActive : ""}`}
              onClick={() => setAccessibilityMode((current) => !current)}
              aria-pressed={accessibilityMode}
              data-testid="caption-player-accessibility-mode-button"
            >
              Accessibility Mode: {accessibilityMode ? "ON" : "OFF"}
            </button>
            <p className={styles.modeSummary} data-testid="caption-player-mode-summary">
              {accessibilityMode
                ? "XL captions, high contrast, expanded transcript, and sign overlay are enabled."
                : "Use individual controls or turn Accessibility Mode on for the full optimized layout."}
            </p>
          </div>

          <div className={styles.searchBlock}>
            <label className={styles.searchLabel} htmlFor="caption-player-search-input">
              Search captions
            </label>
            <div className={styles.searchRow}>
              <input
                ref={searchInputRef}
                id="caption-player-search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={styles.searchInput}
                placeholder="Search words or time"
                data-testid="caption-player-search-input"
              />
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setSearchQuery("")}
                data-testid="caption-player-search-clear-button"
              >
                Clear
              </button>
            </div>
            <p className={styles.searchMeta} aria-live="polite" data-testid="caption-player-search-results-meta">
              {filteredCues.length} matching caption{filteredCues.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className={styles.controlGrid}>
            <fieldset className={styles.controlGroup}>
              <legend className={styles.controlLegend}>Caption language</legend>
              <div className={styles.optionRow}>
                {captionTracks.map((track) => (
                  <button
                    key={track.srclang}
                    type="button"
                    className={`${styles.optionButton} ${selectedCaptionLanguage === track.srclang ? styles.optionButtonActive : ""}`}
                    aria-pressed={selectedCaptionLanguage === track.srclang}
                    onClick={() => setSelectedCaptionLanguage(track.srclang)}
                    data-testid={`caption-player-language-${track.srclang}-button`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {!accessibilityMode ? (
              <>
            <fieldset className={styles.controlGroup}>
              <legend className={styles.controlLegend}>Caption size</legend>
              <div className={styles.optionRow}>
                {CAPTION_SIZES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.optionButton} ${effectiveCaptionSize === option.value ? styles.optionButtonActive : ""}`}
                    aria-pressed={effectiveCaptionSize === option.value}
                    onClick={() => setCaptionSize(option.value)}
                    data-testid={`caption-player-size-${option.value}-button`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.controlGroup}>
              <legend className={styles.controlLegend}>Theme</legend>
              <div className={styles.optionRow}>
                {CAPTION_THEMES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.optionButton} ${effectiveCaptionTheme === option.value ? styles.optionButtonActive : ""}`}
                    aria-pressed={effectiveCaptionTheme === option.value}
                    onClick={() => setCaptionTheme(option.value)}
                    data-testid={`caption-player-theme-${option.value}-button`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.controlGroup}>
              <legend className={styles.controlLegend}>Line spacing</legend>
              <div className={styles.optionRow}>
                {CAPTION_SPACING.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.optionButton} ${effectiveCaptionSpacing === option.value ? styles.optionButtonActive : ""}`}
                    aria-pressed={effectiveCaptionSpacing === option.value}
                    onClick={() => setCaptionSpacing(option.value)}
                    data-testid={`caption-player-spacing-${option.value}-button`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.controlGroup}>
              <legend className={styles.controlLegend}>Caption panel</legend>
              <div className={styles.optionRow}>
                {PANEL_STYLES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.optionButton} ${effectivePanelStyle === option.value ? styles.optionButtonActive : ""}`}
                    aria-pressed={effectivePanelStyle === option.value}
                    onClick={() => setPanelStyle(option.value)}
                    data-testid={`caption-player-panel-${option.value}-button`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
              </>
            ) : null}

            {signOverlayVideo ? (
              <fieldset className={styles.controlGroup}>
                <legend className={styles.controlLegend}>Sign overlay</legend>
                <div className={styles.optionRow}>
                  {OVERLAY_MODES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.optionButton} ${effectiveOverlayMode === option.value ? styles.optionButtonActive : ""}`}
                      aria-pressed={effectiveOverlayMode === option.value}
                      onClick={() => setOverlayMode(option.value)}
                      data-testid={`caption-player-overlay-${option.value}-button`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          <p className={styles.shortcutText} data-testid="caption-player-keyboard-help">
            Keyboard shortcuts: / search, ↑ and ↓ browse transcript, ← and → seek, Enter jump, Space play or pause, + or - adjust size, T change theme, L switch language, O toggle sign overlay, A toggle Accessibility Mode.
          </p>
        </div>
        <div className={styles.liveCaptionBox} aria-live="polite" data-testid="caption-player-live-caption-box">
          <p className={styles.liveCaptionLabel}>Live caption · {selectedTrack?.label ?? "English"}</p>
          <p className={styles.liveCaptionText} data-testid="caption-player-live-caption-text">
            {captionError ? captionError : activeCue ? highlightText(activeCue.text, searchQuery, styles.highlight) : "Captions will appear here."}
          </p>
        </div>
      </div>

      <aside className={`${styles.transcriptPanel} ${accessibilityMode ? styles.transcriptExpanded : ""}`} aria-label={transcriptTitle} data-testid="caption-player-transcript-panel">
        <h3 className={styles.transcriptTitle}>{transcriptTitle} · {selectedTrack?.label ?? "English"}</h3>
        <div className={styles.transcriptList}>
          {captionError ? (
            <p className={styles.errorText} data-testid="caption-player-caption-error">
              {captionError}
            </p>
          ) : !filteredCues.length ? (
            <p className={styles.noResults} data-testid="caption-player-search-no-results">
              No captions match your search yet.
            </p>
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
                className={`${styles.transcriptLine} ${cueIndex === activeIndex ? styles.activeLine : ""}`}
                onClick={() => jumpToCue(cue)}
                data-testid={`caption-player-transcript-line-${index + 1}`}
                aria-current={cueIndex === activeIndex ? "true" : undefined}
              >
                <span className={styles.timestamp}>{formatTime(cue.start)}</span>
                <span>{highlightText(cue.text, searchQuery, styles.highlight)}</span>
              </button>
              );
            })
          )}
        </div>
      </aside>
    </section>
  );
}
