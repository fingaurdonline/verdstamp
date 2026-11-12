export default function Loader() {
  return (
    <span className="flex h-6 items-end gap-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 animate-pulse rounded-full bg-lnd-accent"
          style={{
            height: `${[55, 100, 40][i]}%`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}
