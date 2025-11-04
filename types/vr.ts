
// STEP 13: Create types/vr.ts
// TypeScript type definitions

export interface VRCapabilities {
  webXRSupported: boolean;
  webVRSupported: boolean;
  mobileVRSupported: boolean;
  deviceName: string | null;
  capabilities: string[];
}

export interface VRVideoData {
  id: number;
  title: string;
  youtubeId: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  subject: string;
  vrSupported: boolean;
  concepts: string[];
  vrFeatures: string[];
  thumbnail: string;
  interactionPoints?: VRInteractionPoint[];
}

export interface VRInteractionPoint {
  id: string;
  time: number;
  concept: string;
  description: string;
  type: 'quiz' | 'info' | 'model' | 'experiment';
  completed: boolean;
}

export interface VRSessionData {
  id: string;
  userId: string;
  videoId: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  vrModeUsed: boolean;
  interactionsCompleted: number;
  completionRate: number;
}

export interface VRLearningProgress {
  userId: string;
  totalVRTime: number;
  sessionsCompleted: number;
  subjectsStudied: string[];
  averageRating: number;
  achievementsUnlocked: string[];
  currentStreak: number;
}
