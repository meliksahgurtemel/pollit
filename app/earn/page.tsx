import Poll from '@/components/Poll';

const activePolls = [
  {
    id: 1,
    title: "What's your favorite mobile payment app?",
    participants: 1234,
    remainingTime: "2h 15m",
    reward: 50
  },
  {
    id: 2,
    title: "How often do you use social media?",
    participants: 856,
    remainingTime: "5h 30m",
    reward: 30
  },
  {
    id: 3,
    title: "Which streaming service offers the best content?",
    participants: 2541,
    remainingTime: "1h 45m",
    reward: 45
  },
  {
    id: 4,
    title: "Do you prefer working from home or office?",
    participants: 1678,
    remainingTime: "3h 20m",
    reward: 35
  },
  {
    id: 5,
    title: "What's your primary mode of transportation?",
    participants: 943,
    remainingTime: "4h 10m",
    reward: 40
  }
];

export default function EarnPage() {
  return (
    <div className="flex flex-col py-6">
      {/* Header */}
      <div className="px-2 mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          Active Polls <span className="bounce">🗳️</span>
        </h1>
        <p className="text-zinc-400">
          Participate in polls to earn tokens
        </p>
      </div>

      {/* Polls List */}
      <div className="px-2">
        <div className="space-y-3">
          {activePolls.map((poll) => (
            <Poll
              key={poll.id}
              id={poll.id}
              title={poll.title}
              participants={poll.participants}
              remainingTime={poll.remainingTime}
              reward={poll.reward}
            />
          ))}
        </div>
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-24" />
    </div>
  );
}