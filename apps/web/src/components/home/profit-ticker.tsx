"use client";

import { formatTibiaCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";

interface ProfitTickerProps {
  recentHunts: {
    id: string;
    characterName: string;
    huntName: string;
    profit: number;
    timeAgo: Date;
  }[];
  totalProfit: number;
}

export function ProfitTicker({ recentHunts, totalProfit }: ProfitTickerProps) {
  // We duplicate the list to ensure seamless looping
  const tickerItems = [...recentHunts, ...recentHunts];

  // If no hunts, don't render or render placeholder
  if (!recentHunts || recentHunts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 mb-12">
      {/* Header / Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-foreground">
              Live Market Activity
            </h3>
            <p className="text-xs text-muted-foreground">
              Recent hunts tracked by community
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 bg-card border border-border/50 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
          <span className="text-sm text-muted-foreground font-medium">
            Total Profit Tracked:
          </span>
          <span className="text-lg font-black text-emerald-500 font-mono">
            {formatTibiaCurrency(totalProfit)} Gold
          </span>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden bg-card/50 border-y border-border/50 backdrop-blur-sm py-4">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 pr-6"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
            }}
            style={{ width: "fit-content" }}
          >
            {tickerItems.map((hunt, index) => (
              <div
                key={`${hunt.id}-${index}`}
                className="flex items-center gap-3 bg-background border border-border rounded-lg px-4 py-2 min-w-[280px] shrink-0 shadow-sm"
              >
                <div
                  className={`p-1.5 rounded-full ${hunt.profit >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {hunt.profit >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground truncate max-w-[120px]">
                    {hunt.characterName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {hunt.huntName}
                  </span>
                </div>

                <div className="ml-auto flex flex-col items-end">
                  <span
                    className={`font-mono font-bold text-sm ${hunt.profit >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {hunt.profit > 0 ? "+" : ""}
                    {formatTibiaCurrency(hunt.profit)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(hunt.timeAgo).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {/* Duplicate again to be safe for wide screens if needed, 
                 but rely on the logic that tickerItems is already doubled. 
                 Ideally, we'd use a more robust marquee lib, but this is a good start. 
             */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
