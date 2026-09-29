export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian text-center">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Animated luxury geometric mark */}
        <div className="relative h-12 w-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-ping opacity-30" />
          <div className="h-10 w-10 border border-gold-400/40 rotate-45 transition-transform duration-700 animate-spin [animation-duration:6s]" />
          <div className="absolute h-2 w-2 bg-gold-400 rounded-full" />
        </div>

        <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-300/80 animate-pulse">
          Synchronizing ZAVEN Atelier
        </p>
      </div>
    </div>
  );
}
