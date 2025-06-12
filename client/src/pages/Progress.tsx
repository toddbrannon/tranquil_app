import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Brain, TrendingUp, Flame, Clock, Target, Trophy, Award } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { progressManager, type StreakData, type Milestone } from "@/lib/progress";

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

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-soft)]">Your Progress</h1>
      
      {/* Weekly Overview */}
      <Card className="p-4 shadow-sm">
        <h2 className="font-semibold text-[var(--text-soft)] mb-4">This Week</h2>
        <div className="flex justify-between items-end h-24 mb-4">
          {weekDays.map((day, index) => (
            <div key={day} className="flex flex-col items-center">
              <div 
                className="bg-primary/20 rounded-t-md w-6"
                style={{ height: `${weeklyData[index]}%` }}
              />
              <span className="text-xs text-[var(--text-muted)] mt-2">{day}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary">{streakData?.weeklyMinutes || 0}</span>
          <span className="text-[var(--text-muted)] ml-1">minutes this week</span>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {streakData?.currentStreak || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Day Streak</div>
        </Card>

        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {streakData?.totalMinutes || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Total Minutes</div>
        </Card>

        <Card className="p-4 text-center">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {streakData?.completions.length || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)]">Sessions</div>
        </Card>
      </div>

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
