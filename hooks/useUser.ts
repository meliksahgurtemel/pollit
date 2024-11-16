import { db } from "@/lib/firebase";
import { User, UserStats } from "@/lib/types/user";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFirebaseAuth } from "./useFirebaseAuth";

const fetchUser = async (username: string | null) => {
  if (!username) return null;

  const userRef = doc(db, 'users', username);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: Omit<User, 'id'> = {
      tokensEarned: 0,
      totalParticipations: 0,
      participatedPolls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userRef, newUser);
    return newUser as UserStats;
  }

  const userData = userSnap.data() as Omit<User, 'id'>;
  return userData as UserStats;
};

export function useUser() {
  const { session } = useFirebaseAuth();
  const queryClient = useQueryClient();

  const { data: userStats, isLoading, error } = useQuery({
    queryKey: ['user', session?.user?.name],
    queryFn: () => fetchUser(session?.user?.name ?? null),
    enabled: !!session?.user?.name,
  });

  const updateUserStatsMutation = useMutation({
    mutationFn: async ({ pollId, tokensEarned }: { pollId: string, tokensEarned: number }) => {
      if (!session?.user?.name) throw new Error('No user session');

      const userRef = doc(db, 'users', session.user.name);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as Omit<User, 'id'>;

      await updateDoc(userRef, {
        tokensEarned: userData.tokensEarned + tokensEarned,
        totalParticipations: userData.totalParticipations + 1,
        participatedPolls: [...userData.participatedPolls, pollId],
        updatedAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.name] });
    },
  });

  return {
    userStats: userStats || { tokensEarned: 0, totalParticipations: 0, participatedPolls: [] },
    isLoading,
    error: error ? String(error) : null,
    updateUserStats: updateUserStatsMutation.mutate,
    isUpdating: updateUserStatsMutation.isPending,
    mutate: () => queryClient.invalidateQueries({ queryKey: ['user', session?.user?.name] }),
  };
}