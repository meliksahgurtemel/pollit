import { UserStats } from "@/lib/types/user";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchProfile = async (uid: string) => {
  const { data } = await axios.get<UserStats>(`/api/users/${uid}`);
  return data;
};

export function useProfile(uid: string) {
  const {
    data: profileData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['profile', uid],
    queryFn: () => fetchProfile(uid),
    enabled: !!uid,
  });

  return {
    profileData,
    isLoading,
    error: error ? String(error) : null
  };
}