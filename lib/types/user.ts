export interface User {
  id: string;
  tokensEarned: number;
  totalParticipations: number;
  participatedPolls: string[]; // Array of poll IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  tokensEarned: number;
  totalParticipations: number;
  participatedPolls: number;
}