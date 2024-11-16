'use client'

import LoadingSpinner from "@/components/LoadingSpinner";
import { useProfile } from "@/hooks/useProfile";
import { useUserRank } from "@/hooks/useUserRank";
import { User2, Trophy, Coins, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { uid } = useParams();
  const { profileData, isLoading: profileLoading, error: profileError } = useProfile(uid as string);
  const { rank, isLoading: rankLoading } = useUserRank(uid as string);

  if (profileLoading || rankLoading) {
    return <LoadingSpinner />;
  }

  if (profileError || !profileData) {
    return <div>Error: {profileError || 'Profile not found'}</div>;
  }

  const stats = [
    {
      icon: Trophy,
      label: "Rank",
      value: `#${rank || '-'}`,
      color: "text-yellow-500"
    },
    {
      icon: Coins,
      label: "Tokens Earned",
      value: profileData.tokensEarned.toLocaleString() || "0",
      color: "text-yellow-500"
    },
    {
      icon: CheckCircle2,
      label: "Completed Polls",
      value: profileData.totalParticipations.toString() || "0",
      color: "text-emerald-500"
    }
  ];

  return (
    <div className="flex flex-col py-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          {profileData.profilePictureUrl ? (
            <img
              src={profileData.profilePictureUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User2 className="w-12 h-12 text-zinc-500" />
          )}
        </div>
        <h2 className="text-xl font-semibold">
          {profileData.username || 'Anonymous User'}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {profileData.walletAddress ?
            `${profileData.walletAddress.slice(0, 6)}...${profileData.walletAddress.slice(-4)}` :
            'No wallet connected'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="px-2">
        <div className="grid grid-cols-1 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">{stat.label}</p>
                    <p className="text-xl font-semibold mt-0.5">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-24" />
    </div>
  );
}