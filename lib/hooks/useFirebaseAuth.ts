import { auth } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function useFirebaseAuth() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // Handle initial loading state
      if (status === 'loading') return;

      try {
        // If no session, attempt Worldcoin sign in
        if (!session?.user) {
          await signIn('worldcoin', {
            redirect: false,
          });
          return;
        }

        // If we have a session, proceed with Firebase auth
        if (session.user.name) {
          const { data } = await axios.post('/api/auth/createToken', {
            uid: session.user.name
          });

          await signInWithCustomToken(auth, data.token);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to authenticate');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [session, status]);

  return { isLoading, error, session };
}