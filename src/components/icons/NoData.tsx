import { JSX, SVGProps } from "react";

/**
 * Branded empty-state illustration. Uses Verdstamp tokens so it stays legible
 * in both light and dark themes and on landing, auth and dashboard surfaces.
 */
export default function NoData(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect
        x="9"
        y="12"
        width="46"
        height="40"
        rx="9"
        className="fill-lnd-surface-2 stroke-lnd-border"
        strokeWidth="2"
      />
      <path
        d="M21 25h22M21 32h15"
        className="stroke-lnd-fg-muted"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle
        cx="46"
        cy="44"
        r="10"
        className="fill-lnd-accent/15 stroke-lnd-accent"
        strokeWidth="2"
      />
      <path
        d="M46 39.5v9M41.5 44h9"
        className="stroke-lnd-accent"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
