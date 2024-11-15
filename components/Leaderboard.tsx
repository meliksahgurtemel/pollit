import { Trophy, Crown, Medal } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Alex Kim', points: '12,450', icon: Crown, iconColor: 'text-yellow-500' },
  { rank: 2, name: 'Sarah Chen', points: '10,230', icon: Medal, iconColor: 'text-zinc-300' },
  { rank: 3, name: 'Mike Johnson', points: '8,740', icon: Medal, iconColor: 'text-amber-600' },
];

export default function Leaderboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Top Earners</h2>
        <Trophy className="w-4 h-4 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800">
                <user.icon className={`w-4 h-4 ${user.iconColor}`} />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-zinc-400">{user.points} tokens</p>
              </div>
            </div>
            <div className="text-sm font-medium text-zinc-400">
              #{user.rank}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}