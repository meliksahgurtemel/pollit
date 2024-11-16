import { auth } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function useFirebaseAuth() {
  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // Skip if still loading
      if (status === 'loading') {
        console.log('Still loading session...');
        return;
      }

      setIsSessionLoading(false);

      try {
        // Check if already authenticated with Firebase
        if (auth.currentUser) {
          console.log('Already authenticated with Firebase', auth.currentUser.uid);
          setIsLoading(false);
          return;
        }

        // Only attempt sign in if no session
        if (!session?.user) {
          console.log('No session, initiating Worldcoin sign in');
          await signIn('worldcoin');
          return;
        }

        // Proceed with Firebase auth only if not already authenticated
        if (session.user.name) {
          console.log('Creating Firebase token');
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