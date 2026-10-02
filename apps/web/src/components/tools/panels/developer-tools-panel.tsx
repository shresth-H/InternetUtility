"use client";

import { useState } from "react";
import {
  formatJSON,
  validateJSON,
  decodeJWT,
  generateUUID,
  encodeBase64,
  decodeBase64,
  encodeURL,
  decodeURL,
} from "@internet-utility/tools";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CopyButton } from "../copy-button";

export function DeveloperToolsPanel({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [uuids, setUuids] = useState<string[]>([]);

  if (slug === "json-formatter") {
    const result = input ? formatJSON(input) : null;
    return (
      <div className="space-y-4">
        <Textarea placeholder='{"key": "value"}' value={input} onChange={(e) => setInput(e.target.value)} rows={8} />
        {result && (
          <div className="space-y-2">
            {!result.valid && <p className="text-sm text-[var(--danger)]">{result.error}</p>}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{result.valid ? "Formatted JSON" : "Invalid JSON"}</span>
              {result.valid && <CopyButton text={result.formatted} />}
            </div>
            <Textarea value={result.formatted} readOnly rows={12} className={result.valid ? "" : "border-[var(--danger)]"} />
          </div>
        )}
      </div>
    );
  }

  if (slug === "json-validator") {
    const result = input ? validateJSON(input) : null;
    return (
      <div className="space-y-4">
        <Textarea placeholder="Paste JSON to validate..." value={input} onChange={(e) => setInput(e.target.value)} rows={8} />
        {result && (
          <div className={`rounded-lg border p-4 ${result.valid ? "border-[var(--success)] bg-green-500/5" : "border-[var(--danger)] bg-red-500/5"}`}>
            <p className="font-medium">{result.valid ? "✓ Valid JSON" : "✗ Invalid JSON"}</p>
            {result.type && <p className="text-sm text-muted mt-1">Type: {result.type}</p>}
            {result.error && <p className="text-sm text-[var(--danger)] mt-1">{result.error}</p>}
          </div>
        )}
      </div>
    );
  }

  if (slug === "jwt-decoder") {
    const result = input ? decodeJWT(input) : null;
    return (
      <div className="space-y-4">
        <Textarea placeholder="Paste JWT token..." value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
        {result && (
          <div className="space-y-4">
            {!result.valid && <p className="text-sm text-[var(--danger)]">{result.error}</p>}
            {result.valid && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Header</p>
                  <pre className="rounded-lg border border-border bg-card p-4 text-xs overflow-x-auto">
                    {JSON.stringify(result.header, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Payload</p>
                  <pre className="rounded-lg border border-border bg-card p-4 text-xs overflow-x-auto">
                    {JSON.stringify(result.payload, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  if (slug === "uuid-generator") {
    return (
      <div className="space-y-4">
        <Button onClick={() => setUuids((prev) => [generateUUID(), ...prev].slice(0, 10))}>
          Generate UUID
        </Button>
        {uuids.length > 0 && (
          <ul className="space-y-2">
            {uuids.map((uuid) => (
              <li key={uuid} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm">
                {uuid}
                <CopyButton text={uuid} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (slug === "base64-encoder-decoder" || slug === "url-encoder-decoder") {
    const isBase64 = slug === "base64-encoder-decoder";
    const result =
      input &&
      (mode === "encode"
        ? { result: isBase64 ? encodeBase64(input) : encodeURL(input) }
        : isBase64
          ? decodeBase64(input)
          : decodeURL(input));

    return (
      <div className="space-y-4">
        <Select value={mode} onChange={(e) => setMode(e.target.value as "encode" | "decode")}>
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </Select>
        <Textarea placeholder="Enter text..." value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
        {result && (
          <div className="rounded-lg border border-border bg-card p-4">
            {"error" in result && result.error ? (
              <p className="text-sm text-[var(--danger)]">{result.error}</p>
            ) : (
              <div className="flex justify-between gap-4">
                <p className="font-mono text-sm break-all flex-1">{result.result}</p>
                {result.result && <CopyButton text={result.result} />}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
