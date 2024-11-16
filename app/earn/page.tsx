'use client'

import Poll from '@/components/Poll';
import { usePolls } from '@/hooks/usePolls';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { PollType } from '@/lib/types/poll';

interface PollWithRemainingTime extends PollType {
  remainingTime: string;
  hasParticipated?: boolean;
}

const calculateRemainingTime = (endsAt: any) => {
  try {
    const endDate = new Date(endsAt._seconds * 1000);
    const now = new Date();
    const distance = endDate.getTime() - now.getTime();

    if (distance < 0) return '0h 0m';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    return days > 0
      ? `${days}d ${hours}h`
      : `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating remaining time:', error);
    return '0h 0m';
  }
};

export default function EarnPage() {
  const { polls, isLoading: pollsLoading, error: pollsError } = usePolls();
  const { userStats, isLoading: userLoading, error: userError } = useUser();
  const [pollsWithTime, setPollsWithTime] = useState<PollWithRemainingTime[]>([]);

  useEffect(() => {
    if (!polls || !userStats) return;

    // Initial calculation
    const withTime = polls.map(poll => ({
      ...poll,
      remainingTime: calculateRemainingTime(poll.endsAt),
      hasParticipated: userStats.participatedPolls.includes(poll.id)
    }));
    setPollsWithTime(withTime);

    // Update remaining time every minute
    const interval = setInterval(() => {
      setPollsWithTime(currentPolls =>
        currentPolls.map(poll => ({
          ...poll,
          remainingTime: calculateRemainingTime(poll.endsAt)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [polls, userStats]);

  if (pollsLoading || userLoading) {
    return <div>Loading polls...</div>;
  }

  if (pollsError || userError) {
    return <div>Error: {pollsError || userError}</div>;
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
          {pollsWithTime
            .filter(poll => poll.remainingTime !== '0h 0m')
            .map((poll) => (
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