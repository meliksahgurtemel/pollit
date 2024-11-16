import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface LeaderboardUser {
  rank: number;
  id: string;
  points: number;
  icon: 'Crown' | 'Medal';
  iconColor: string;
}

const fetchLeaderboard = async () => {
  const { data } = await axios.get<LeaderboardUser[]>('/api/leaderboard');
  return data;
};

export function useLeaderboard() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 30000,
  });

  return {
    users: users || [],
    isLoading,
    error: error ? String(error) : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
  };
}