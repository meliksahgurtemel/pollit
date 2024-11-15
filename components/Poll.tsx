import { Users, Clock } from 'lucide-react';

interface PollProps {
  title: string;
  participants: number;
  remainingTime: string;
  reward: number;
}

export default function Poll({ title, participants, remainingTime, reward }: PollProps) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium leading-tight">{title}</h3>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-sm text-zinc-400">{participants}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-sm text-zinc-400">{remainingTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-1 rounded-full">
          <span className="text-sm font-medium text-yellow-500">+{reward}</span>
        </div>
      </div>
    </div>
  );
}