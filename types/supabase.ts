export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          nullifier_hash: string
          verification_level: string
          created_at: string
          last_login: string
        }
        Insert: {
          id?: string
          nullifier_hash: string
          verification_level: string
          created_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          nullifier_hash?: string
          verification_level?: string
          created_at?: string
          last_login?: string
        }
      }
      // ... other tables
    }
  }
}