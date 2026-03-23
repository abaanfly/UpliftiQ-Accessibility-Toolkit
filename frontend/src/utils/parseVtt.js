export const parseVtt = (content) => {
  const blocks = content.replace(/^WEBVTT\s*/i, "").trim().split(/\n\s*\n/);

  return blocks.flatMap((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const timingLine = lines.find((line) => line.includes("-->"));
    if (!timingLine) return [];

    const [startRaw, endRaw] = timingLine.split("-->").map((part) => part.trim());
    const toSeconds = (value) => {
      const parts = value.replace(",", ".").split(":").map(Number);
      const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
      return hours * 3600 + minutes * 60 + seconds;
    };

    return [{
      id: `cue-${index + 1}`,
      start: toSeconds(startRaw),
      end: toSeconds(endRaw),
      text: lines.filter((line) => line !== timingLine && !/^\d+$/.test(line)).join(" "),
    }];
  });
};
