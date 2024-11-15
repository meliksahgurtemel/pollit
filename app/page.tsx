import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <div className="space-y-8 py-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome to PollIt</h1>
        <p className="text-zinc-400">
          Participate in polls, share your opinion, and earn rewards! 🚀
        </p>
      </div>

      <HowItWorks />
    </div>
  );
}
