'use client';

import { usePolls } from "@/hooks/usePolls";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft, Coins, Timer, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { toast } from "sonner";

export default function PollPage() {
  const { id } = useParams();
  const router = useRouter();
  const { session } = useFirebaseAuth();
  const { polls, isLoading: pollsLoading, mutate: mutatePolls } = usePolls();
  const { userStats, isLoading: userLoading, mutate: mutateUser } = useUser();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const poll = polls.find(p => p.id === id);

  if (pollsLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (!poll) {
    return <div>Poll not found</div>;
  }

  const handleSubmit = async () => {
    if (!selectedOption || !session?.user?.name) return;

    try {
      setIsSubmitting(true);

      const { data } = await axios.post('/api/polls/vote', {
        pollId: poll.id,
        optionId: selectedOption,
        userId: session.user.name
      });

      // Show success message with styled token amount
      toast.success(
        <div>
          You earned <span className="text-yellow-500">{poll.reward} tokens</span>!
        </div>
      );

      // Refresh polls and user data
      await Promise.all([mutatePolls(), mutateUser()]);

      // Redirect to earn page
      router.push('/earn');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Failed to submit vote');
      } else {
        toast.error('An error occurred');
      }
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col py-6">
      {/* Header */}
      <div className="px-2 mb-6">
        <Link href="/earn" className="flex items-center gap-2 text-zinc-400 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Polls
        </Link>

        <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>

        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{poll.totalParticipants}</span>
          </div>

          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>{poll.remainingTime}</span>
          </div>

          <div className="flex items-center gap-1 ml-auto text-yellow-500">
            <Coins className="w-4 h-4" />
            <span>{poll.reward}</span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="px-2">
        <div className="space-y-3">
          {poll.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-4 rounded-xl border text-left transition-colors ${
                selectedOption === option.id
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitting}
          className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </button>
      </div>
    </div>
  );
}