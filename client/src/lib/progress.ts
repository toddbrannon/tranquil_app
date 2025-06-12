export interface ExerciseCompletion {
  exerciseId: string;
  date: string;
  duration: number;
  feeling?: 'great' | 'good' | 'okay' | 'tired';
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  weeklyMinutes: number;
  completions: ExerciseCompletion[];
  lastCompletionDate: string;
}

export interface Milestone {
  id: string;
  type: 'streak' | 'minutes' | 'sessions';
  target: number;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: string;
}

class ProgressManager {
  private getStreakData(): StreakData {
    const stored = localStorage.getItem('userProgress');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalMinutes: 0,
      weeklyMinutes: 0,
      completions: [],
      lastCompletionDate: ''
    };
  }

  private saveStreakData(data: StreakData): void {
    localStorage.setItem('userProgress', JSON.stringify(data));
  }

  private getMilestones(): Milestone[] {
    const stored = localStorage.getItem('userMilestones');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize default milestones
    const defaultMilestones: Milestone[] = [
      {
        id: 'first-session',
        type: 'sessions',
        target: 1,
        title: 'First Steps',
        description: 'Complete your first exercise',
        achieved: false
      },
      {
        id: 'week-streak',
        type: 'streak',
        target: 7,
        title: '7-Day Streak',
        description: 'Practice for 7 consecutive days',
        achieved: false
      },
      {
        id: 'hundred-minutes',
        type: 'minutes',
        target: 100,
        title: 'Century Club',
        description: 'Complete 100 minutes of practice',
        achieved: false
      },
      {
        id: 'month-streak',
        type: 'streak',
        target: 30,
        title: 'Consistency Master',
        description: 'Practice for 30 consecutive days',
        achieved: false
      }
    ];
    
    localStorage.setItem('userMilestones', JSON.stringify(defaultMilestones));
    return defaultMilestones;
  }

  private saveMilestones(milestones: Milestone[]): void {
    localStorage.setItem('userMilestones', JSON.stringify(milestones));
  }

  private calculateStreak(completions: ExerciseCompletion[]): number {
    if (completions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // Get unique completion dates sorted in descending order
    const dateSet: { [key: string]: boolean } = {};
    completions.forEach(c => { dateSet[c.date] = true; });
    const completionDates = Object.keys(dateSet)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    for (const dateStr of completionDates) {
      const completionDate = new Date(dateStr);
      completionDate.setHours(0, 0, 0, 0);
      
      if (completionDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (completionDate.getTime() < currentDate.getTime()) {
        // Gap in streak
        break;
      }
    }
    
    return streak;
  }

  private getWeeklyMinutes(completions: ExerciseCompletion[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return completions
      .filter(c => new Date(c.date) >= oneWeekAgo)
      .reduce((sum, c) => sum + c.duration, 0);
  }

  completeExercise(exerciseId: string, duration: number): { 
    streakData: StreakData, 
    newMilestones: Milestone[],
    isNewRecord: boolean 
  } {
    const streakData = this.getStreakData();
    const milestones = this.getMilestones();
    const today = new Date().toISOString().split('T')[0];
    
    // Add new completion
    const completion: ExerciseCompletion = {
      exerciseId,
      date: today,
      duration
    };
    
    streakData.completions.push(completion);
    streakData.totalMinutes += duration;
    streakData.lastCompletionDate = today;
    
    // Recalculate streak
    const newStreak = this.calculateStreak(streakData.completions);
    const isNewRecord = newStreak > streakData.longestStreak;
    
    streakData.currentStreak = newStreak;
    if (isNewRecord) {
      streakData.longestStreak = newStreak;
    }
    
    streakData.weeklyMinutes = this.getWeeklyMinutes(streakData.completions);
    
    // Check for new milestones
    const newMilestones: Milestone[] = [];
    const sessionCount = streakData.completions.length;
    
    milestones.forEach(milestone => {
      if (!milestone.achieved) {
        let shouldAchieve = false;
        
        switch (milestone.type) {
          case 'sessions':
            shouldAchieve = sessionCount >= milestone.target;
            break;
          case 'streak':
            shouldAchieve = streakData.currentStreak >= milestone.target;
            break;
          case 'minutes':
            shouldAchieve = streakData.totalMinutes >= milestone.target;
            break;
        }
        
        if (shouldAchieve) {
          milestone.achieved = true;
          milestone.achievedDate = today;
          newMilestones.push(milestone);
        }
      }
    });
    
    this.saveStreakData(streakData);
    this.saveMilestones(milestones);
    
    return { streakData, newMilestones, isNewRecord };
  }

  getProgressData(): StreakData {
    return this.getStreakData();
  }

  getMilestoneProgress(): Milestone[] {
    return this.getMilestones();
  }

  updateFeeling(exerciseId: string, date: string, feeling: ExerciseCompletion['feeling']): void {
    const streakData = this.getStreakData();
    const completion = streakData.completions.find(c => 
      c.exerciseId === exerciseId && c.date === date
    );
    
    if (completion) {
      completion.feeling = feeling;
      this.saveStreakData(streakData);
    }
  }
}

export const progressManager = new ProgressManager();