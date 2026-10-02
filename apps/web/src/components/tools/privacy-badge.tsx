import { Lock, Server, Shield } from "lucide-react";
import type { ToolPrivacy } from "@internet-utility/tools";

export function PrivacyBadge({ privacy }: { privacy: ToolPrivacy }) {
  const Icon = privacy.location === "client" ? Shield : Server;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-accent/50 p-4">
      <Icon className="h-5 w-5 shrink-0 text-primary mt-0.5" />
      <div>
        <p className="font-medium text-sm flex items-center gap-2">
          <Lock className="h-3.5 w-3.5" />
          {privacy.location === "client" ? "Runs in your browser" : "Secure server processing"}
        </p>
        <p className="mt-1 text-sm text-muted">{privacy.message}</p>
      </div>
    </div>
  );
}
