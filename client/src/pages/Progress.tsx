import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Brain, TrendingUp, Flame, Clock, Target, Trophy, Award, RotateCcw, Calendar, Activity } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { progressManager, type StreakData, type Milestone } from "@/lib/progress";
import exercisesData from "@/data/exercises.json";

interface QuizResult {
  id: string;
  score: number;
  answers: Record<number, number>;
  completedAt: string;
  category: string;
}

export default function Progress() {
  const [assessmentResults, setAssessmentResults] = useState<QuizResult[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    // Load assessment results from localStorage
    const stored = localStorage.getItem('quiz_results');
    if (stored) {
      setAssessmentResults(JSON.parse(stored));
    }

    // Load progress data
    const progressData = progressManager.getProgressData();
    const milestoneData = progressManager.getMilestoneProgress();
    setStreakData(progressData);
    setMilestones(milestoneData);
  }, []);

  // Generate weekly chart data from completions
  const getWeeklyChartData = () => {
    if (!streakData) return [0, 0, 0, 0, 0, 0, 0];
    
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const weeklyMinutes = Array(7).fill(0);
    
    streakData.completions.forEach(completion => {
      const completionDate = new Date(completion.date);
      const dayIndex = completionDate.getDay();
      const daysSinceWeekStart = Math.floor((completionDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceWeekStart >= 0 && daysSinceWeekStart < 7) {
        weeklyMinutes[dayIndex] += completion.duration;
      }
    });
    
    const maxMinutes = Math.max(...weeklyMinutes, 1);
    return weeklyMinutes.map(minutes => (minutes / maxMinutes) * 100);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = getWeeklyChartData();

  // Get exercise type counts
  const getExerciseTypeCounts = () => {
    if (!streakData) return { move: 0, breathe: 0, meditate: 0 };
    
    const counts = { move: 0, breathe: 0, meditate: 0 };
    
    streakData.completions.forEach(completion => {
      const exercise = exercisesData.exercises.find((ex: any) => ex.id === completion.exerciseId);
      if (exercise) {
        counts[exercise.category as keyof typeof counts]++;
      }
    });
    
    return counts;
  };

  // Get mood data for the last 7 days
  const getMoodChart = () => {
    if (!streakData) return Array(7).fill(null);
    
    const today = new Date();
    const moodData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCompletions = streakData.completions.filter(c => c.date === dateStr);
      const feelings = dayCompletions.map(c => c.feeling).filter(f => f !== undefined) as ('great' | 'good' | 'okay' | 'tired')[];
      
      // Get most common feeling for the day, or null if none
      let mood = null;
      if (feelings.length > 0) {
        const moodCounts = feelings.reduce((acc: any, feeling) => {
          if (feeling) {
            acc[feeling] = (acc[feeling] || 0) + 1;
          }
          return acc;
        }, {});
        const moodKeys = Object.keys(moodCounts);
        if (moodKeys.length > 0) {
          mood = moodKeys.reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
        }
      }
      
      moodData.push(mood);
    }
    
    return moodData;
  };

  const exerciseTypeCounts = getExerciseTypeCounts();
  const moodChart = getMoodChart();

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case 'great': return '😊';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'tired': return '😴';
      default: return '⚪';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-soft)]">Your Progress</h1>
      
      {/* Assessment Section */}
      <Card className="p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--text-soft)]">Wellness Assessment</h2>
          <Link href="/assessment">
            <Button size="sm" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          </Link>
        </div>
        
        {assessmentResults.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Latest Score</span>
              <Badge variant="secondary" className="text-primary">
                {assessmentResults[assessmentResults.length - 1].score}/100
              </Badge>
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Last taken: {new Date(assessmentResults[assessmentResults.length - 1].completedAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Take your first assessment to track your wellness journey</p>
        )}
      </Card>

      {/* Minutes Chart - Last 7 Days */}
      <Card className="p-4 shadow-sm">
        <h2 className="font-semibold text-[var(--text-soft)] mb-4">Practice Minutes (Last 7 Days)</h2>
        <div className="flex justify-between items-end h-24 mb-4">
          {weekDays.map((day, index) => {
            const actualMinutes = streakData?.completions
              .filter(c => {
                const completionDate = new Date(c.date);
                const dayOfWeek = completionDate.getDay();
                const today = new Date();
                const daysAgo = 6 - index;
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() - daysAgo);
                return completionDate.toDateString() === targetDate.toDateString();
              })
              .reduce((sum, c) => sum + c.duration, 0) || 0;
            
            return (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className="bg-primary/20 rounded-t-md w-6 flex items-end justify-center"
                  style={{ height: `${weeklyData[index]}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-[var(--text-muted)] mt-2">{day}</span>
                <span className="text-xs text-primary font-medium">{actualMinutes}m</span>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary">{streakData?.weeklyMinutes || 0}</span>
          <span className="text-[var(--text-muted)] ml-1">minutes this week</span>
        </div>
      </Card>

      {/* Current & Longest Streak */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {streakData?.currentStreak || 0}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Current Streak</div>
        </Card>

        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {streakData?.longestStreak || 0}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Longest Streak</div>
        </Card>
      </div>

      {/* Mood Tracking - 7 Day Chart */}
      <Card className="p-4 shadow-sm">
        <h2 className="font-semibold text-[var(--text-soft)] mb-4">Mood Tracking (Last 7 Days)</h2>
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => (
            <div key={day} className="flex flex-col items-center space-y-2">
              <div className="text-2xl">
                {getMoodEmoji(moodChart[index])}
              </div>
              <span className="text-xs text-[var(--text-muted)]">{day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1 text-xs">
            <span>😊</span>
            <span className="text-[var(--text-muted)]">Great</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>🙂</span>
            <span className="text-[var(--text-muted)]">Good</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>😐</span>
            <span className="text-[var(--text-muted)]">Okay</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>😴</span>
            <span className="text-[var(--text-muted)]">Tired</span>
          </div>
        </div>
      </Card>

      {/* Exercise Counts by Type */}
      <Card className="p-4 shadow-sm">
        <h2 className="font-semibold text-[var(--text-soft)] mb-4">Exercise Summary</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-sm">Move</span>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {exerciseTypeCounts.move} sessions
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Breathe</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {exerciseTypeCounts.breathe} sessions
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Meditate</span>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {exerciseTypeCounts.meditate} sessions
            </Badge>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--text-soft)]">Total Sessions</span>
            <span className="font-bold text-primary">{streakData?.completions.length || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="font-medium text-[var(--text-soft)]">Total Minutes</span>
            <span className="font-bold text-primary">{streakData?.totalMinutes || 0}</span>
          </div>
        </div>
      </Card>

      {/* Milestones */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[var(--text-soft)]">Milestones</h2>
        {milestones.map(milestone => (
          <Card key={milestone.id} className="p-4 shadow-sm flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              milestone.achieved ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              {milestone.achieved ? (
                <Trophy className="w-6 h-6 text-yellow-600" />
              ) : (
                <Award className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${
                milestone.achieved ? 'text-[var(--text-soft)]' : 'text-[var(--text-muted)]'
              }`}>
                {milestone.title}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                {milestone.description}
              </div>
              {milestone.achieved && milestone.achievedDate && (
                <div className="text-xs text-primary mt-1">
                  Achieved {new Date(milestone.achievedDate).toLocaleDateString()}
                </div>
              )}
            </div>
            {milestone.achieved && (
              <div className="text-green-600">
                <Target className="w-5 h-5" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Assessment Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-soft)]">Assessment History</h2>
          <Link href="/assessment">
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Take New
            </Button>
          </Link>
        </div>
        
        {assessmentResults.length > 0 ? (
          <div className="space-y-3">
            {assessmentResults.slice(-3).reverse().map((result) => (
              <Card key={result.id} className="p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-soft)]">
                        Score: {result.score}/100
                      </div>
                      <div className="text-sm text-[var(--text-muted)]">
                        {result.category} • {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-[var(--text-soft)] mb-2">No Assessments Yet</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Take your first wellness assessment to track your nervous system health over time.
            </p>
            <Link href="/assessment">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Take Assessment
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
