import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trophy, Flame, Clock, Target, ChevronRight, Play } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import exercisesData from "@/data/exercises.json";
import { progressManager, type StreakData, type Milestone } from "@/lib/progress";

interface Exercise {
  id: string;
  title: string;
  duration: number;
  description: string;
  instructor: string;
  category: string;
  section: string;
  backgroundImage: string;
  isPremium: boolean;
  tags: string[];
  techniques: string[];
  format: string;
}

interface CompletionData {
  exerciseId: string;
  duration: number;
}

export default function ExerciseCompletion() {
  const [, setLocation] = useLocation();
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [newMilestones, setNewMilestones] = useState<Milestone[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<'great' | 'good' | 'okay' | 'tired' | null>(null);
  const [showMilestones, setShowMilestones] = useState(false);

  useEffect(() => {
    // Get completion data from localStorage (passed from exercise player)
    const stored = localStorage.getItem('tempCompletionData');
    console.log('ExerciseCompletion: Checking for completion data...', stored);
    
    if (stored) {
      const data = JSON.parse(stored);
      console.log('ExerciseCompletion: Found completion data:', data);
      setCompletionData(data);
      
      // Process completion and update progress
      const result = progressManager.completeExercise(data.exerciseId, data.duration);
      setStreakData(result.streakData);
      setNewMilestones(result.newMilestones);
      setIsNewRecord(result.isNewRecord);
      
      // Show milestones after a delay if there are any
      if (result.newMilestones.length > 0) {
        setTimeout(() => setShowMilestones(true), 2000);
      }
      
      // Clean up temp data
      localStorage.removeItem('tempCompletionData');
    } else {
      // Redirect if no completion data
      setLocation('/');
    }
  }, [setLocation]);

  if (!completionData || !streakData) {
    return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  const exercise = exercisesData.exercises.find((ex: Exercise) => ex.id === completionData.exerciseId) as Exercise;
  
  if (!exercise) {
    return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">Exercise not found</div>
    </div>;
  }

  const handleFeelingSelection = (feeling: 'great' | 'good' | 'okay' | 'tired') => {
    setSelectedFeeling(feeling);
    const today = new Date().toISOString().split('T')[0];
    progressManager.updateFeeling(exercise.id, today, feeling);
  };

  const getSuggestedExercises = (): Exercise[] => {
    // Get exercises from same category or section, excluding current one
    const candidates = exercisesData.exercises.filter((ex: Exercise) => 
      ex.id !== exercise.id && (
        ex.category === exercise.category || 
        ex.section === exercise.section
      )
    );
    
    // Prioritize non-premium exercises
    const nonPremium = candidates.filter((ex: Exercise) => !ex.isPremium);
    const suggested = nonPremium.length >= 3 ? nonPremium : candidates;
    
    return suggested.slice(0, 3);
  };

  const suggestedExercises = getSuggestedExercises();

  const feelingOptions = [
    { value: 'great', label: '😊 Great', color: 'bg-green-500' },
    { value: 'good', label: '🙂 Good', color: 'bg-blue-500' },
    { value: 'okay', label: '😐 Okay', color: 'bg-yellow-500' },
    { value: 'tired', label: '😴 Tired', color: 'bg-gray-500' }
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Milestone Celebration Overlay */}
      {showMilestones && newMilestones.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Milestone Achieved!</h2>
            {newMilestones.map(milestone => (
              <div key={milestone.id} className="mb-4">
                <h3 className="font-semibold text-primary">{milestone.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{milestone.description}</p>
              </div>
            ))}
            <Button onClick={() => setShowMilestones(false)} className="w-full">
              Continue
            </Button>
          </Card>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Congratulations Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Well Done!
            </h1>
            <p className="text-[var(--text-muted)] mt-1">
              You completed "{exercise.title}"
            </p>
          </div>
        </div>

        {/* How are you feeling? */}
        <Card className="p-4">
          <h2 className="font-semibold text-[var(--text-soft)] mb-3">How are you feeling?</h2>
          <div className="grid grid-cols-2 gap-2">
            {feelingOptions.map(option => (
              <Button
                key={option.value}
                variant={selectedFeeling === option.value ? "default" : "outline"}
                onClick={() => handleFeelingSelection(option.value)}
                className="h-auto py-3"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Streak & Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Day Streak
              {isNewRecord && <Badge variant="secondary" className="ml-1 text-xs">New Record!</Badge>}
            </div>
          </Card>

          <Card className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {streakData.totalMinutes}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Total Minutes
            </div>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[var(--text-soft)]">This Week</h3>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Practice time</span>
              <span className="font-medium">{streakData.weeklyMinutes} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Sessions</span>
              <span className="font-medium">
                {streakData.completions.filter(c => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(c.date) >= oneWeekAgo;
                }).length}
              </span>
            </div>
          </div>
        </Card>

        {/* Suggested Next Exercises */}
        {suggestedExercises.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-[var(--text-soft)] mb-3">Keep Going</h3>
            <div className="space-y-3">
              {suggestedExercises.map(suggestedEx => (
                <Link key={suggestedEx.id} href={`/exercise/${suggestedEx.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[var(--bg-secondary)] transition-colors">
                    <div 
                      className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${suggestedEx.backgroundImage})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[var(--text-primary)] truncate">
                        {suggestedEx.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                        <span className="text-xs text-[var(--text-muted)]">
                          {suggestedEx.duration} min
                        </span>
                        {suggestedEx.isPremium && (
                          <Badge variant="secondary" className="text-xs">Premium</Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Link href="/">
            <Button className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link href="/exercises">
            <Button variant="outline" className="w-full" size="lg">
              Explore More Exercises
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}