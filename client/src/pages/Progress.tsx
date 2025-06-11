import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Progress() {
  const weeklyStats = {
    totalMinutes: 147,
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = [60, 40, 80, 30, 70, 0, 0]; // Heights in percentage

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
    </div>
  );
}
