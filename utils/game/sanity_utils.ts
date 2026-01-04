export function getCorruptedText(text: string, sanity: number): string {
  if (sanity > 60) return text;

  // Level 1: Mild Glitch (60 > Sanity > 30)
  // Randomly replace characters with similar looking ones or glitch chars
  if (sanity > 30) {
    if (Math.random() > 0.3) return text; // 70% chance to be normal per call? No, per render check.
    // Actually per string.
    return text
      .split("")
      .map((char) => {
        if (Math.random() < 0.1) {
          const glitchChars = [
            "@",
            "#",
            "$",
            "%",
            "&",
            "?",
            "!",
            "x",
            "0",
            "1",
          ];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      })
      .join("");
  }

  // Level 2: Heavy Glitch (Sanity <= 30)
  // Replace words with dark thoughts
  if (sanity <= 30) {
    // 50% chance to completely mangle
    if (Math.random() < 0.5) {
      const darkThoughts = ["等死", "放弃", "没救了", "..."];
      // If text is short (like button), replace it
      if (text.length < 5) {
        return darkThoughts[Math.floor(Math.random() * darkThoughts.length)];
      }
    }

    // Mangle characters heavily
    return text
      .split("")
      .map((char) => {
        if (Math.random() < 0.4) {
          const glitchChars = ["☠️", "❌", "..."];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      })
      .join("");
  }

  return text;
}
