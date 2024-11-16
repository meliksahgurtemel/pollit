import type { PollType } from "@/lib/types/poll";
import axios from "axios";
import { useEffect, useState } from "react";

export function usePolls() {
  const [polls, setPolls] = useState<PollType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<PollType[]>('/api/polls');
      setPolls(data);
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
  }, []);

  return { polls, isLoading, error, mutate: fetchPolls };
}