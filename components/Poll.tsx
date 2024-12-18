import type { PollType } from "@/lib/types/poll";
import { Users, Timer, Coins, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type PollProps = Omit<PollType, 'options' | 'createdAt' | 'endsAt'> & {
  hasParticipated?: boolean;
};

export default function Poll({
  id,
  title,
  totalParticipants,
  remainingTime,
  reward,
  hasParticipated
}: PollProps) {
  return (
    <Link href={`/earn/${id}`}>
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900/70 transition-colors relative">
        {hasParticipated && (
          <div className="absolute top-4 right-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        )}

        <h3 className="font-medium text-lg mb-3 pr-8">{title}</h3>

        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalParticipants}</span>
          </div>

          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>{remainingTime}</span>
          </div>

          <div className="flex items-center gap-1 ml-auto text-yellow-500">
            <Coins className="w-4 h-4" />
            <span>{reward}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}