import { Trophy, CheckCircle2 } from 'lucide-react';

export default function Stats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-zinc-400">Earned Tokens</span>
        </div>
        <p className="text-2xl font-semibold">2,450</p>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-zinc-400">Completed Polls</span>
        </div>
        <p className="text-2xl font-semibold">28</p>
      </div>
    </div>
  );
}