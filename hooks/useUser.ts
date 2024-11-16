import { db } from "@/lib/firebase";
import { User, UserStats } from "@/lib/types/user";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFirebaseAuth } from "./useFirebaseAuth";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"
import { useEffect } from "react";

const fetchUser = async (userkey: string | null) => {
  if (!userkey) return null;

  const userRef = doc(db, 'users', userkey);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const newUser: Omit<User, 'id'> = {
      tokensEarned: 0,
      totalParticipations: 0,
      participatedPolls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      username: '',
      walletAddress: '',
      profilePictureUrl: '',
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

  useEffect(() => {
    if (!session?.user?.name) return;

    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async payload => {
      if (payload.status === 'error') {
        console.error('MiniKit auth error:', payload);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.name] });
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
    };
  }, [session?.user?.name, queryClient]);

  const { data: userStats, isLoading, error } = useQuery({
    queryKey: ['user', session?.user?.name],
    queryFn: async () => {
      const userData = await fetchUser(session?.user?.name ?? null);

      if (MiniKit.user) {
        return {
          ...userData,
          username: MiniKit.user.username,
          walletAddress: MiniKit.user.walletAddress,
          profilePictureUrl: MiniKit.user.profilePictureUrl,
        };
      }

      return userData;
    },
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
    userStats: userStats || {
      tokensEarned: 0,
      totalParticipations: 0,
      participatedPolls: [],
      username: '',
      walletAddress: '',
      profilePictureUrl: '',
    },
    isLoading,
    error: error ? String(error) : null,
    updateUserStats: updateUserStatsMutation.mutate,
    isUpdating: updateUserStatsMutation.isPending,
    mutate: () => queryClient.invalidateQueries({ queryKey: ['user', session?.user?.name] }),
  };
}