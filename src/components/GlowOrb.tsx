export default function GlowOrb({ className = '' }: { className?: string }) {
  return <div className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}
