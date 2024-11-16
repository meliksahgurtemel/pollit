import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    users: users || [],
    isLoading,
    error: error ? String(error) : null
  };
}