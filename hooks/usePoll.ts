import { PollType } from "@/lib/types/poll";
import axios from "axios";
import { useEffect, useState } from "react";
import { calculateRemainingTime } from "@/lib/utils";

export function usePoll(id: string) {
  const [poll, setPoll] = useState<PollType | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data } = await axios.get<PollType>(`/api/polls/${id}`);
        setPoll(data);
        setRemainingTime(calculateRemainingTime(data.endsAt));
        setTotalVotes(data.options.reduce((sum, option) => sum + option.votes, 0));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to fetch poll');
        } else {
          setError('Failed to fetch poll');
        }
        console.error('Error fetching poll:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPoll();
    }

    // Update remaining time every minute
    const interval = setInterval(() => {
      if (poll?.endsAt) {
        setRemainingTime(calculateRemainingTime(poll.endsAt));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [id, poll?.endsAt]);

  return {
    poll,
    remainingTime,
    totalVotes,
    isLoading,
    error
  };
}