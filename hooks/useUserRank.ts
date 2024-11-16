import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchUserRank = async (uid: string) => {
  const { data } = await axios.get<{ rank: number }>(`/api/users/rank?uid=${uid}`);
  return data.rank;
};

export function useUserRank(uid: string | null) {
  const {
    data: rank,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userRank', uid],
    queryFn: () => fetchUserRank(uid!),
    enabled: !!uid,
  });

  return {
    rank,
    isLoading,
    error: error ? String(error) : null
  };
}