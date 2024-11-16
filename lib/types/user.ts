export interface User {
  id: string;
  tokensEarned: number;
  totalParticipations: number;
  participatedPolls: string[]; // Array of poll IDs
  createdAt: Date;
  updatedAt: Date;
  username: string | null;
  walletAddress: string | null;
  profilePictureUrl: string | null;
}

export interface UserStats {
  tokensEarned: number;
  totalParticipations: number;
  participatedPolls: string[];
  username: string | null;
  walletAddress: string | null;
  profilePictureUrl: string | null;
}
