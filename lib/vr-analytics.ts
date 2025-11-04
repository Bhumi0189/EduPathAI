export interface VRSessionData {
  sessionId: string;
  userId: string;
  subject: string;
  duration: number;
  interactionCount: number;
  completionRate: number;
  accuracy: number;
  timestamp: Date;
}

export interface VRLearningMetrics {
  totalVRTime: number;
  sessionsCompleted: number;
  averageAccuracy: number;
  preferredSubjects: string[];
  improvementRate: number;
}

export class VRAnalytics {
  private static instance: VRAnalytics;
  private sessions: VRSessionData[] = [];

  static getInstance(): VRAnalytics {
    if (!VRAnalytics.instance) {
      VRAnalytics.instance = new VRAnalytics();
    }
    return VRAnalytics.instance;
  }

  trackSession(sessionData: VRSessionData) {
    this.sessions.push(sessionData);
    this.saveToLocalStorage();
  }

  getSessionMetrics(userId: string): VRLearningMetrics {
    const userSessions = this.sessions.filter(session => session.userId === userId);
    
    const totalVRTime = userSessions.reduce((total, session) => total + session.duration, 0);
    const sessionsCompleted = userSessions.length;
    const averageAccuracy = userSessions.reduce((total, session) => total + session.accuracy, 0) / sessionsCompleted;
    
    const subjectCounts = userSessions.reduce((counts, session) => {
      counts[session.subject] = (counts[session.subject] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const preferredSubjects = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);

    // Calculate improvement rate
    const recentSessions = userSessions.slice(-5);
    const oldSessions = userSessions.slice(0, 5);
    const recentAvg = recentSessions.reduce((total, session) => total + session.accuracy, 0) / recentSessions.length;
    const oldAvg = oldSessions.reduce((total, session) => total + session.accuracy, 0) / oldSessions.length;
    const improvementRate = oldSessions.length > 0 ? ((recentAvg - oldAvg) / oldAvg) * 100 : 0;

    return {
      totalVRTime,
      sessionsCompleted,
      averageAccuracy,
      preferredSubjects,
      improvementRate
    };
  }

  getProgressData(userId: string, timeframe: 'week' | 'month' | 'year') {
    const userSessions = this.sessions.filter(session => session.userId === userId);
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return userSessions
      .filter(session => session.timestamp >= startDate)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vr-analytics', JSON.stringify(this.sessions));
    }
  }

  private loadFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vr-analytics');
      if (saved) {
        this.sessions = JSON.parse(saved).map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }));
      }
    }
  }
}