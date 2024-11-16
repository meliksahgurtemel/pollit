import { PollType } from "@/lib/types/poll";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { calculateRemainingTime } from "@/lib/utils";

interface PollDetails {
  poll: PollType | null;
  remainingTime: string;
  totalVotes: number;
}

const fetchPoll = async (id: string) => {
  const { data } = await axios.get<PollType>(`/api/polls/${id}`);
  return data;
};

export function usePoll(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['poll', id],
    queryFn: () => fetchPoll(id),
    select: (data): PollDetails => ({
      poll: data,
      remainingTime: calculateRemainingTime(data.endsAt),
      totalVotes: data.options.reduce((sum, option) => sum + option.votes, 0),
    }),
    enabled: !!id,
    refetchInterval: 60000,
  });

  return {
    poll: data?.poll || null,
    remainingTime: data?.remainingTime || '',
    totalVotes: data?.totalVotes ?? 0,
    isLoading,
    error: error ? String(error) : null,
  };
}