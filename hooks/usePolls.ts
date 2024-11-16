import type { PollType } from "@/lib/types/poll";
import axios from "axios";
import { useEffect, useState } from "react";

export function usePolls() {
  const [polls, setPolls] = useState<PollType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
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

    fetchPolls();
  }, []);

  return { polls, isLoading, error };
}