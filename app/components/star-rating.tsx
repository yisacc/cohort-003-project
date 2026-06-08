import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface StarRatingDisplayProps {
  average: number | null;
  count: number;
  className?: string;
}

export function StarRatingDisplay({ average, count, className }: StarRatingDisplayProps) {
  if (average === null || count === 0) return null;

  const rounded = Math.round(average * 2) / 2;

  return (
    <span className={cn("flex items-center gap-1", className)}>
      <Stars value={rounded} />
      <span className="text-xs text-muted-foreground">
        {average.toFixed(1)} ({count})
      </span>
    </span>
  );
}

interface StarRatingInputProps {
  currentRating: number | null;
  courseId: number;
}

export function StarRatingInput({ currentRating, courseId }: StarRatingInputProps) {
  return (
    <form method="post" className="flex items-center gap-2">
      <input type="hidden" name="intent" value="rate" />
      <input type="hidden" name="courseId" value={courseId} />
      <span className="text-sm text-muted-foreground">
        {currentRating ? "Your rating:" : "Rate this course:"}
      </span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="submit"
            name="rating"
            value={star}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            className="p-0.5 transition-colors hover:text-yellow-400 focus-visible:outline-none"
          >
            <Star
              className={cn(
                "size-5",
                currentRating !== null && star <= currentRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    </form>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value >= star;
        const half = !filled && value >= star - 0.5;
        return (
          <Star
            key={star}
            className={cn(
              "size-3.5",
              filled
                ? "fill-yellow-400 text-yellow-400"
                : half
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "fill-none text-muted-foreground/40"
            )}
          />
        );
      })}
    </span>
  );
}