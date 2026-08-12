type OrnamentProps = {
  className?: string;
  light?: boolean;
};

export default function Ornament({ className = "", light = false }: OrnamentProps) {
  const line = light
    ? "from-transparent to-ivory/40"
    : "from-transparent to-gold/60";
  const lineRev = light
    ? "bg-gradient-to-l from-transparent to-ivory/40"
    : "bg-gradient-to-l from-transparent to-gold/60";
  const star = light ? "text-gold-light" : "text-gold";

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className={`h-px w-12 bg-gradient-to-r sm:w-24 ${line}`} />
      <span className={`text-xs leading-none ${star}`}>✦</span>
      <span className={`h-px w-12 sm:w-24 ${lineRev}`} />
    </div>
  );
}
