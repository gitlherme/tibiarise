import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ProfitManagerCardProps {
  title: string;
  icon?: React.ReactNode;
  highlight: string;
  note?: string;
  variant?: "profit" | "loss" | "neutral";
}

export const ProfitManagerCard = ({
  title,
  icon,
  highlight,
  note,
  variant = "neutral",
}: ProfitManagerCardProps) => {
  const numericValue = Number(highlight);
  const isProfit = numericValue > 0;
  const isLoss = numericValue < 0;

  // Auto-detect variant if not specified
  const finalVariant =
    variant === "neutral"
      ? isProfit
        ? "profit"
        : isLoss
          ? "loss"
          : "neutral"
      : variant;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-soft p-6 transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg cursor-default group",
        finalVariant === "profit" && "border-l-4 border-l-success",
        finalVariant === "loss" && "border-l-4 border-l-destructive",
        finalVariant === "neutral" && "border-l-4 border-l-primary",
      )}
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "p-2 rounded-lg",
                finalVariant === "profit" && "bg-green-500/20 text-green-400",
                finalVariant === "loss" && "bg-red-500/20 text-red-400",
                finalVariant === "neutral" && "bg-primary/20 text-primary",
              )}
            >
              {icon}
            </span>
            <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
          </div>

          {/* Trend indicator */}
          {finalVariant !== "neutral" && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                finalVariant === "profit" && "bg-green-500/20 text-green-400",
                finalVariant === "loss" && "bg-red-500/20 text-red-400",
              )}
            >
              {finalVariant === "profit" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
            </span>
          )}
        </div>

        {/* Value */}
        <div
          className={cn(
            "text-3xl font-bold tracking-tight",
            finalVariant === "profit" && "text-green-400 text-glow-primary",
            finalVariant === "loss" && "text-red-400",
            finalVariant === "neutral" && "text-primary text-glow-primary",
          )}
        >
          {numericValue < 0 ? "-" : ""}
          {new Intl.NumberFormat().format(Math.abs(numericValue))}
        </div>

        {/* Note */}
        {note && (
          <p className="text-xs text-muted-foreground mt-2 truncate">{note}</p>
        )}
      </div>
    </div>
  );
};
