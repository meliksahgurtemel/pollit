import type { PollType } from "@/lib/types/poll";
import { calculateRemainingTime } from "@/lib/utils";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface PollWithStatus extends PollType {
  remainingTime: string;
  hasParticipated?: boolean;
}

const fetchPolls = async () => {
  const { data } = await axios.get<PollType[]>('/api/polls');
  return data;
};

export function usePolls(participatedPolls?: string[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['polls', participatedPolls],
    queryFn: fetchPolls,
    select: (data): PollWithStatus[] => {
      const pollsWithStatus = data.map(poll => ({
        ...poll,
        remainingTime: calculateRemainingTime(poll.endsAt),
        hasParticipated: participatedPolls?.includes(poll.id)
      }));

      return pollsWithStatus.filter(poll => poll.remainingTime !== '0h 0m');
    },
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    polls: data || [],
    isLoading,
    error: error ? String(error) : null,
  };
}