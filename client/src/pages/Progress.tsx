import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Brain, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

interface QuizResult {
  id: string;
  score: number;
  answers: Record<number, number>;
  completedAt: string;
  category: string;
}

export default function Progress() {
  const [assessmentResults, setAssessmentResults] = useState<QuizResult[]>([]);

  const weeklyStats = {
    totalMinutes: 147,
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = [60, 40, 80, 30, 70, 0, 0]; // Heights in percentage

  useEffect(() => {
    // Load assessment results from localStorage
    const stored = localStorage.getItem('quiz_results');
    if (stored) {
      setAssessmentResults(JSON.parse(stored));
    }
  }, []);

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
          <span className="text-2xl font-bold text-primary">{weeklyStats.totalMinutes}</span>
          <span className="text-[var(--text-muted)] ml-1">minutes this week</span>
        </div>
      </Card>

      {/* Achievements */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[var(--text-soft)]">Recent Achievements</h2>
        <Card className="p-4 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600 fill-current" />
          </div>
          <div>
            <div className="font-medium text-[var(--text-soft)]">5-Day Streak!</div>
            <div className="text-sm text-[var(--text-muted)]">Keep up the consistency</div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-primary fill-current" />
          </div>
          <div>
            <div className="font-medium text-[var(--text-soft)]">First Meditation</div>
            <div className="text-sm text-[var(--text-muted)]">Welcome to your wellness journey</div>
          </div>
        </Card>
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
