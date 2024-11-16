import { Trophy, Crown, Medal } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import LoadingSpinner from './LoadingSpinner';

const icons = {
  Crown,
  Medal
};

export default function Leaderboard() {
  const { users, isLoading, error } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        No data available yet
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Top Earners</h2>
        <Trophy className="w-4 h-4 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {users.map((user) => {
          const Icon = icons[user.icon];
          return (
            <div
              key={user.rank}
              className="flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800">
                  <Icon className={`w-4 h-4 ${user.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium">User #{user.id.slice(0, 6)}</p>
                  <p className="text-sm text-zinc-400">
                    {user.points.toLocaleString()} tokens
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-zinc-400">
                #{user.rank}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}