import HowItWorks from '@/components/HowItWorks';
import { Trophy } from 'lucide-react';

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

          <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-full px-4 py-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">2,450</span>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mt-4">
        <HowItWorks />
      </div>
      <div className="h-24" />
    </div>
  );
}
