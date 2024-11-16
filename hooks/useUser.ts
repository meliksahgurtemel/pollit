import { db } from "@/lib/firebase";
import { User, UserStats } from "@/lib/types/user";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "./useFirebaseAuth";

export function useUser() {
  const { session } = useFirebaseAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!session?.user?.name) return;

    try {
      setIsLoading(true);
      const userRef = doc(db, 'users', session.user.name);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user if doesn't exist
        const newUser: Omit<User, 'id'> = {
          tokensEarned: 0,
          totalParticipations: 0,
          participatedPolls: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(userRef, newUser);
        setUserStats({
          tokensEarned: 0,
          totalParticipations: 0,
          participatedPolls: [],
        });
      } else {
        const userData = userSnap.data() as Omit<User, 'id'>;
        setUserStats({
          tokensEarned: userData.tokensEarned,
          totalParticipations: userData.totalParticipations,
          participatedPolls: userData.participatedPolls,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      console.error('Error fetching user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session]);

  // const updateUserStats = async (pollId: string, tokensEarned: number) => {
  //   if (!session?.user?.name) return;

  //   try {
  //     const userRef = doc(db, 'users', session.user.name);
  //     const userSnap = await getDoc(userRef);
  //     const userData = userSnap.data() as Omit<User, 'id'>;

  //     await updateDoc(userRef, {
  //       tokensEarned: userData.tokensEarned + tokensEarned,
  //       totalParticipations: userData.totalParticipations + 1,
  //       participatedPolls: [...userData.participatedPolls, pollId],
  //       updatedAt: new Date(),
  //     });

  //     // Update local stats
  //     setUserStats(prev => prev ? {
  //       ...prev,
  //       tokensEarned: prev.tokensEarned + tokensEarned,
  //       totalParticipations: prev.totalParticipations + 1,
  //       participatedPolls: prev.participatedPolls + 1,
  //     } : null);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to update user stats');
  //     console.error('Error updating user stats:', err);
  //   }
  // };

  return {
    userStats,
    isLoading,
    error,
    mutate: fetchUser
  };
}