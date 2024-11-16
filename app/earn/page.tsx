'use client'

import Poll from '@/components/Poll';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePolls } from '@/hooks/usePolls';
import { useUser } from '@/hooks/useUser';

export default function EarnPage() {
  const {
    userStats,
    isLoading: userLoading,
    error: userError
  } = useUser();
  const {
    polls,
    isLoading: pollsLoading,
    error: pollsError
  } = usePolls(userStats?.participatedPolls);

  if (pollsLoading || userLoading) {
    return <LoadingSpinner />;
  }

  if (pollsError || userError) {
    return <div>Error: {String(pollsError || userError)}</div>;
  }

  return (
    <div className="flex flex-col py-6">
      {/* Header */}
      <div className="px-2 mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Active Polls <span className="bounce">🗳️</span>
        </h1>
        <p className="text-zinc-400">
          Participate in polls to earn tokens
        </p>
      </div>

      {/* Polls List */}
      <div className="px-2">
        <div className="flex flex-col space-y-4">
          {polls.map((poll) => (
            <Poll
              key={poll.id}
              id={poll.id}
              title={poll.title}
              totalParticipants={poll.totalParticipants}
              remainingTime={poll.remainingTime}
              reward={poll.reward}
              hasParticipated={poll.hasParticipated}
            />
          ))}
        </div>
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-24" />
    </div>
  );
}