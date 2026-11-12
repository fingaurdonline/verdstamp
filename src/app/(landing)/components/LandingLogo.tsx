export default function LandingLogo({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 48 48"
            className={className}
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="24"
                cy="24"
                r="22"
                className="fill-lnd-accent-fill"
            />
            <circle
                cx="24"
                cy="24"
                r="16.5"
                fill="none"
                stroke="rgb(var(--lnd-accent-fg))"
                strokeWidth="1.4"
                strokeDasharray="2.2 2.4"
                opacity="0.55"
            />
            <path
                d="M15.5 17.5 24 32l8.5-14.5"
                fill="none"
                stroke="rgb(var(--lnd-accent-fg))"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
