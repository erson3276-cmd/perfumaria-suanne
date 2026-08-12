import { IconStar } from "@/components/icons";

type Props = {
  rating: number;
  reviews?: number;
  className?: string;
};

export default function Rating({ rating, reviews, className }: Props) {
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <div className="flex items-center gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.round(rating) ? "opacity-100" : "opacity-20"
            }`}
          />
        ))}
      </div>
      {typeof reviews === "number" && (
        <span className="text-xs text-ink-soft">({reviews})</span>
      )}
    </div>
  );
}
