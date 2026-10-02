"use client";

import { useState } from "react";
import {
  countWords,
  countCharacters,
  convertCase,
  removeDuplicateLines,
  textDiff,
} from "@internet-utility/tools";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CopyButton } from "../copy-button";

export function TextToolsPanel({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [textB, setTextB] = useState("");
  const [caseMode, setCaseMode] = useState<Parameters<typeof convertCase>[1]>("upper");
  const [dedupeResult, setDedupeResult] = useState<{ result: string; removed: number } | null>(null);

  if (slug === "word-counter") {
    const stats = countWords(text);
    return (
      <div className="space-y-4">
        <Textarea
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            ["Words", stats.words],
            ["Characters", stats.characters],
            ["No Spaces", stats.charactersNoSpaces],
            ["Sentences", stats.sentences],
            ["Paragraphs", stats.paragraphs],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold">{value as number}</p>
              <p className="text-xs text-muted mt-1">{label as string}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "character-counter") {
    const stats = countCharacters(text);
    return (
      <div className="space-y-4">
        <Textarea placeholder="Enter text..." value={text} onChange={(e) => setText(e.target.value)} rows={10} />
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Characters", stats.characters],
            ["Without Spaces", stats.charactersNoSpaces],
            ["Bytes (UTF-8)", stats.bytes],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold">{value as number}</p>
              <p className="text-xs text-muted mt-1">{label as string}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "case-converter") {
    const result = convertCase(text, caseMode);
    return (
      <div className="space-y-4">
        <Textarea placeholder="Enter text to convert..." value={text} onChange={(e) => setText(e.target.value)} rows={6} />
        <Select value={caseMode} onChange={(e) => setCaseMode(e.target.value as typeof caseMode)}>
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="title">Title Case</option>
          <option value="sentence">Sentence case</option>
          <option value="camel">camelCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
        </Select>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Result</span>
            {result && <CopyButton text={result} />}
          </div>
          <p className="font-mono text-sm break-all">{result || "—"}</p>
        </div>
      </div>
    );
  }

  if (slug === "remove-duplicate-lines") {
    return (
      <div className="space-y-4">
        <Textarea placeholder="One item per line..." value={text} onChange={(e) => setText(e.target.value)} rows={8} />
        <Button onClick={() => setDedupeResult(removeDuplicateLines(text))}>Remove Duplicates</Button>
        {dedupeResult && (
          <div className="space-y-2">
            <p className="text-sm text-muted">Removed {dedupeResult.removed} duplicate line(s)</p>
            <Textarea value={dedupeResult.result} readOnly rows={8} />
            <CopyButton text={dedupeResult.result} label="Copy Result" />
          </div>
        )}
      </div>
    );
  }

  if (slug === "text-diff") {
    const lines = textDiff(text, textB);
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Original</label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Modified</label>
            <Textarea value={textB} onChange={(e) => setTextB(e.target.value)} rows={10} />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm overflow-x-auto">
          {lines.length === 0 ? (
            <p className="text-muted">Enter text in both fields to compare</p>
          ) : (
            lines.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === "added"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : line.type === "removed"
                      ? "bg-red-500/10 text-red-700 dark:text-red-400"
                      : ""
                }
              >
                {line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  "}
                {line.content}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
}
