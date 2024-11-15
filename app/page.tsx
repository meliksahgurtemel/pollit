import HowItWorks from '@/components/HowItWorks';
import { Trophy, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="px-2 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Hey there! <span className="wave">👋</span>
            </h1>
            <p className="text-lg text-zinc-400 mt-1">
              Ready to earn some tokens?
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-3">
        <HowItWorks />
      </div>

      {/* Stats Section */}
      <div className="px-2 mt-8">
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
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-24" />
    </div>
  );
}
