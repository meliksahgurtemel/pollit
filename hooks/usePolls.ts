import type { PollType } from "@/lib/types/poll";
import { calculateRemainingTime } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

interface PollWithStatus extends PollType {
  remainingTime: string;
  hasParticipated?: boolean;
}

export function usePolls(participatedPolls?: string[]) {
  const [polls, setPolls] = useState<PollWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<PollType[]>('/api/polls');

      // Add remaining time and participation status to each poll
      const pollsWithStatus = data.map(poll => ({
        ...poll,
        remainingTime: calculateRemainingTime(poll.endsAt),
        hasParticipated: participatedPolls?.includes(poll.id)
      }));

      // Filter out expired polls
      const activePolls = pollsWithStatus.filter(poll => poll.remainingTime !== '0h 0m');

      setPolls(activePolls);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to fetch polls');
      } else {
        setError('Failed to fetch polls');
      }
      console.error('Error fetching polls:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();

    // Update remaining time every minute
    const interval = setInterval(() => {
      setPolls(currentPolls =>
        currentPolls.map(poll => ({
          ...poll,
          remainingTime: calculateRemainingTime(poll.endsAt)
        })).filter(poll => poll.remainingTime !== '0h 0m')
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [participatedPolls]);

  return { polls, isLoading, error, mutate: fetchPolls };
}