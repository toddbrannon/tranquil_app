import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Smile, Brain, TrendingUp, Crown } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

interface PremiumStatus {
  isPremium: boolean;
  plan: string;
  purchaseDate?: string;
  declinedDate?: string;
}

export default function Home() {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);

  const userStats = {
    streak: 5,
    todayMinutes: 0,
    weeklyGoal: 70,
  };

  useEffect(() => {
    const stored = localStorage.getItem('premiumStatus');
    if (stored) {
      setPremiumStatus(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Hero Section */}
      <div 
        className="relative h-48 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/20 to-primary/30"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(15, 118, 110, 0.3)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-semibold">Good Morning</h1>
          <p className="text-white/80 text-sm">Ready to start your wellness journey?</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary">{userStats.streak}</div>
          <div className="text-xs text-[var(--text-muted)]">Day Streak</div>
        </Card>
        <Card className="p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary">{userStats.todayMinutes}</div>
          <div className="text-xs text-[var(--text-muted)]">Today (min)</div>
        </Card>
        <Card className="p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary">{userStats.weeklyGoal}%</div>
          <div className="text-xs text-[var(--text-muted)]">Weekly Goal</div>
        </Card>
      </div>

      {/* Premium CTA or Assessment */}
      {premiumStatus && !premiumStatus.isPremium ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-soft)]">Unlock Your Potential</h2>
          <Link href="/paywall">
            <Card className="p-4 shadow-sm bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-800">Upgrade to Premium</div>
                    <div className="text-sm text-yellow-700">Unlimited assessments & premium content</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-yellow-600" />
              </div>
            </Card>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-soft)]">Understand Your Wellness</h2>
            {premiumStatus?.isPremium && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-800">Premium</span>
              </div>
            )}
          </div>
          <Link href="/assessment">
            <Card className="p-4 shadow-sm bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-soft)]">Take Assessment</div>
                    <div className="text-sm text-[var(--text-muted)]">
                      {premiumStatus?.isPremium ? 'Unlimited assessments' : '10 questions • Get your wellness score'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-soft)]">Start Your Day</h2>
        <Link href="/exercise-player">
          <Card className="p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Smile className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium text-[var(--text-soft)]">Try Your First Exercise</div>
                <div className="text-sm text-[var(--text-muted)]">5 min • Perfect for beginners</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
