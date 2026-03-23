import styles from "./App.module.css";
import { CaptionPlayer } from "@upliftiq/caption-player";
import { CaptionCard, StepLearningCard, VisualAlert, VisualTimer } from "@upliftiq/deaf-ui";
import { SignCard } from "@upliftiq/isl-tools";

const lessonVideo = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const lessonCaptions = [
  { src: "/captions/lesson.vtt", srclang: "en", label: "English", default: true },
  { src: "/captions/lesson-hi.vtt", srclang: "hi", label: "Hindi" },
];

export default function App() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Demo learning platform</p>
          <h1>Build Deaf-friendly lessons with visual clarity.</h1>
          <p className={styles.lead}>
            This lesson page pairs readable captions, transcript navigation, visual alerts, and sign-ready
            learning cards.
          </p>
        </div>
        <VisualAlert
          title="Captions ready"
          message="The lesson includes WebVTT captions and transcript seeking."
          variant="info"
        />
      </section>

      <section className={styles.lessonGrid}>
        <CaptionPlayer
          video={lessonVideo}
          captions={lessonCaptions}
          title="Visual storytelling lesson"
          signOverlayVideo={lessonVideo}
          signOverlayLabel="ISL support video"
          defaultOverlayMode="pip"
          defaultCaptionLanguage="en"
        />
        <div className={styles.sidebar}>
          <VisualTimer seconds={180} title="Practice block" />
          <CaptionCard
            title="Lesson objective"
            caption="Recognize how caption language switching, Accessibility Mode, searchable transcript cues, and sign overlays work together inside one learning flow."
            meta="Objective"
          />
        </div>
      </section>

      <section className={styles.contentGrid}>
        <StepLearningCard
          step="Step 1"
          title="Watch with captions"
          description="Learners can read a high-contrast caption stream without relying on in-video overlays."
        />
        <StepLearningCard
          step="Step 2"
          title="Switch languages, search, and jump through transcript"
          description="Each line is clickable and searchable, and learners can switch between English and Hindi cues at their own pace."
        />
        <SignCard word="Hello" video={lessonVideo} description="Use loop and slow playback to practice a greeting." />
      </section>
    </main>
  );
}
