export interface User {
  id: string
  discord_id: string
  username: string
  avatar: string | null
  email: string | null
  orbit_id: string | null
  points: number
  streak: number
  created_at: string
}

export interface Orbit {
  id: string
  name: string
  discord_server_id: string
  icon: string | null
  member_count: number
  created_at: string
}

export interface Mission {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  type: 'trivia' | 'creative' | 'speed' | 'photo'
  is_limited: boolean
  expires_at: string | null
  week_start: string
  completed?: boolean
  first_completed_at?: string | null
}

export interface WeeklyChallenge {
  id: string
  orbit_id: string
  title: string
  description: string
  week_start: string
  week_end: string
  entries: WeeklyEntry[]
}

export interface WeeklyEntry {
  id: string
  challenge_id: string
  user_id: string
  user: User
  content: string
  votes: number
  voted_by_me?: boolean
}

export interface DailyRitual {
  id: string
  orbit_id: string
  question: string
  date: string
  reveal_at: string
  answered_by_me?: boolean
  answers?: DailyAnswer[]
}

export interface DailyAnswer {
  id: string
  ritual_id: string
  user: User
  answer: string
}

export interface AffinityQuestion {
  id: string
  question: string
  options: string[]
}

export interface Badge {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
}

export interface UserBadge {
  badge: Badge
  earned_at: string
}

export interface LeaderboardEntry {
  position: number
  user: User
  points: number
  streak: number
  badge?: Badge
}

export interface PointsEvent {
  id: string
  user_id: string
  amount: number
  reason: string
  created_at: string
}
