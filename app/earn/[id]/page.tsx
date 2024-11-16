'use client';

import { usePolls } from "@/hooks/usePolls";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft, Coins, Timer, Users, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { toast } from "sonner";

const calculateRemainingTime = (endsAt: any) => {
  try {
    const endDate = new Date(endsAt._seconds * 1000);
    const now = new Date();
    const distance = endDate.getTime() - now.getTime();

    if (distance < 0) return '0h 0m';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    return days > 0
      ? `${days}d ${hours}h`
      : `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating remaining time:', error);
    return '0h 0m';
  }
};

export default function PollPage() {
  const { id } = useParams();
  const router = useRouter();
  const { session } = useFirebaseAuth();
  const { polls, isLoading: pollsLoading, mutate: mutatePolls } = usePolls();
  const { userStats, isLoading: userLoading, mutate: mutateUser } = useUser();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>('');

  const poll = polls.find(p => p.id === id);
  const totalVotes = poll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;

  useEffect(() => {
    if (poll) {
      // Initial calculation
      setRemainingTime(calculateRemainingTime(poll.endsAt));

      // Update remaining time every minute
      const interval = setInterval(() => {
        setRemainingTime(calculateRemainingTime(poll.endsAt));
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [poll]);

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

      toast.success(
        <div>
          You earned <span className="text-yellow-500">{poll.reward} tokens</span>!
        </div>
      );

      await Promise.all([mutatePolls(), mutateUser()]);
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

  const hasParticipated = userStats?.participatedPolls.includes(poll.id);

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
            <span>{remainingTime}</span>
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
              onClick={() => !hasParticipated && setSelectedOption(option.id)}
              disabled={hasParticipated}
              className={`w-full p-4 rounded-xl border text-left transition-colors relative ${
                selectedOption === option.id
                  ? 'bg-blue-500/20 border-blue-500'
                  : hasParticipated
                  ? 'bg-zinc-900/50 border-zinc-800'
                  : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
                {hasParticipated && (
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <BarChart2 className="w-4 h-4" />
                    <span>{((option.votes / totalVotes) * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              {hasParticipated && (
                <div className="absolute left-0 top-0 h-full bg-blue-500/10 rounded-xl"
                  style={{ width: `${(option.votes / totalVotes) * 100}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {!hasParticipated && (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </button>
        )}
      </div>
    </div>
  );
}