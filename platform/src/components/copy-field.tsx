"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <input readOnly value={value} className="input font-mono text-xs" aria-label={label} onFocus={(e) => e.target.select()} />
      <button
        type="button"
        className="btn btn-secondary btn-icon shrink-0"
        aria-label={`Copiar ${label}`}
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
