export function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return { words: 0, characters: 0, charactersNoSpaces: 0, sentences: 0, paragraphs: 0 };
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const characters = trimmed.length;
  const charactersNoSpaces = trimmed.replace(/\s/g, "").length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length;
  return { words, characters, charactersNoSpaces, sentences, paragraphs };
}

export function countCharacters(text: string) {
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    bytes: new TextEncoder().encode(text).length,
  };
}

export type CaseMode = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab";

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case "sentence":
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case "camel":
      return text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^./, (c) => c.toLowerCase());
    case "snake":
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();
    case "kebab":
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
    default:
      return text;
  }
}

export function removeDuplicateLines(text: string): { result: string; removed: number } {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const unique: string[] = [];
  let removed = 0;
  for (const line of lines) {
    if (seen.has(line)) {
      removed++;
    } else {
      seen.add(line);
      unique.push(line);
    }
  }
  return { result: unique.join("\n"), removed };
}

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
}

export function textDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const maxLen = Math.max(linesA.length, linesB.length);
  const result: DiffLine[] = [];

  for (let i = 0; i < maxLen; i++) {
    const a = linesA[i];
    const b = linesB[i];
    if (a === b) {
      if (a !== undefined) result.push({ type: "unchanged", content: a });
    } else {
      if (a !== undefined) result.push({ type: "removed", content: a });
      if (b !== undefined) result.push({ type: "added", content: b });
    }
  }
  return result;
}
