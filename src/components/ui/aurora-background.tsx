export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 -top-32 h-144 w-xl rounded-full bg-brand-500/40 blur-[120px] animate-aurora" />
      <div className="absolute -right-24 top-1/4 h-120 w-120 rounded-full bg-accent-500/30 blur-[120px] animate-aurora [animation-delay:-6s]" />
      <div className="absolute -bottom-40 left-1/3 h-128 w-lg rounded-full bg-fuchsia-500/25 blur-[130px] animate-aurora [animation-delay:-11s]" />
      {/* Subtle grain / vignette to unify the surface */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(6,8,20,0.55)_100%)]" />
    </div>
  );
}
