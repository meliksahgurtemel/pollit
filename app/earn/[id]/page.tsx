'use client';

import { ArrowLeft, Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const pollData = {
  id: 1,
  title: "What's your favorite mobile payment app?",
  participants: 1234,
  remainingTime: "2h 15m",
  reward: 50,
  options: [
    { id: 1, text: "PayPal", votes: 450 },
    { id: 2, text: "Venmo", votes: 380 },
    { id: 3, text: "Cash App", votes: 290 },
    { id: 4, text: "Apple Pay", votes: 114 },
  ]
};

export default function PollPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/50 backdrop-blur-lg border-b border-zinc-800 z-10">
        <div className="px-2 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium">Poll Details</h1>
        </div>
      </div>

      {/* Poll Content */}
      <div className="flex-1 px-2 py-6">
        <div className="space-y-6">
          {/* Poll Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">{pollData.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-sm text-zinc-400">{pollData.participants}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-sm text-zinc-400">{pollData.remainingTime}</span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {pollData.options.map((option) => (
              <button
                key={option.id}
                className="w-full p-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm text-zinc-400">{option.votes} votes</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-lg border-t border-zinc-800">
        <div className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4">
          <div>
            <p className="text-sm text-zinc-400">Reward</p>
            <p className="text-lg font-semibold text-yellow-500">+{pollData.reward} tokens</p>
          </div>
          <button className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
            Submit Vote
          </button>
        </div>
      </div>
    </div>
  );
}