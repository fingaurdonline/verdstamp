"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactEmail({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            toast.success("Email copied to clipboard");
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy the email address");
        }
    };

    return (
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-lnd-border pt-4">
            <a
                href={`mailto:${email}`}
                className="truncate text-sm font-medium text-lnd-fg transition-colors hover:text-lnd-accent"
            >
                {email}
            </a>
            <button
                type="button"
                onClick={copy}
                aria-label={`Copy ${email}`}
                className="shrink-0 rounded-full border border-lnd-border p-2 text-lnd-fg-muted transition-colors hover:border-lnd-accent/40 hover:text-lnd-accent"
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
            </button>
        </div>
    );
}
