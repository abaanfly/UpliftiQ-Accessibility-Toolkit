export interface CaptionCue {
  id: string;
  start: number;
  end: number;
  text: string;
}

const toSeconds = (value: string) => {
  const normalized = value.replace(",", ".").split(":").map(Number);
  const [hours, minutes, seconds] =
    normalized.length === 3 ? normalized : [0, normalized[0], normalized[1]];
  return hours * 3600 + minutes * 60 + seconds;
};

export const parseWebVtt = (content: string): CaptionCue[] => {
  const blocks = content.replace(/^WEBVTT\s*/i, "").trim().split(/\n\s*\n/);

  return blocks.flatMap((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const timingLine = lines.find((line) => line.includes("-->"));
    if (!timingLine) return [];

    const [startRaw, endRaw] = timingLine.split("-->").map((part) => part.trim());
    const text = lines.filter((line) => line !== timingLine && !/^\d+$/.test(line)).join(" ");
    if (!text) return [];

    return [{ id: `cue-${index + 1}`, start: toSeconds(startRaw), end: toSeconds(endRaw), text }];
  });
};
