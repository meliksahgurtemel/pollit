export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface FirestoreTimestamp {
    _seconds: number;
    _nanoseconds: number;
  }

  export interface PollType {
    id: string;
    title: string;
    participants: number;
    reward: number;
    remainingTime: string;
    createdAt: FirestoreTimestamp;
    endsAt: FirestoreTimestamp;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
  }