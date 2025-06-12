import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Smile, Brain, TrendingUp, Crown, Play, Lock, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import exercisesData from "@/data/exercises.json";
import { favoritesManager } from "@/lib/favorites";

interface PremiumStatus {
  isPremium: boolean;
  plan: string;
  purchaseDate?: string;
  declinedDate?: string;
}

interface Exercise {
  id: string;
  title: string;
  duration: number;
  description: string;
  instructor: string;
  category: string;
  backgroundImage: string;
  isPremium: boolean;
  tags: string[];
}

export default function Home() {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);

  const userStats = {
    streak: 5,
    todayMinutes: 0,
    weeklyGoal: 70,
  };

  // Filter exercises by categories
  const suggestedExercises = exercisesData.exercises.filter((exercise: Exercise) => 
    exercise.tags.includes('suggested')
  ).slice(0, 3);

  const popularExercises = exercisesData.exercises.filter((exercise: Exercise) => 
    exercise.tags.includes('popular')
  ).slice(0, 3);

  // Get user's favorite exercises
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const favorites = favoritesManager.getFavorites();
    const favoriteExerciseDetails = favorites.map(fav => 
      exercisesData.exercises.find((ex: Exercise) => ex.id === fav.id)
    ).filter(Boolean) as Exercise[];
    setFavoriteExercises(favoriteExerciseDetails);
  }, []);

  // Exercise Card Component
  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <Card className="shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={exercise.backgroundImage} 
          alt={exercise.title} 
          className="w-full h-32 object-cover"
        />
        {exercise.isPremium && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-[var(--text-soft)] text-sm">{exercise.title}</h3>
            <div className="flex items-center mt-1 text-xs text-[var(--text-muted)]">
              <Clock className="w-3 h-3 mr-1" />
              <span>{exercise.duration} min</span>
            </div>
          </div>
          <Button
            size="icon"
            className="w-8 h-8 bg-primary/10 hover:bg-primary/20 text-primary ml-2"
            variant="ghost"
          >
            <Play className="w-3 h-3 fill-current" />
          </Button>
        </div>
      </div>
    </Card>
  );

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

      {/* Suggested For You */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-soft)]">Suggested For You</h2>
        <div className="grid grid-cols-2 gap-3">
          {suggestedExercises.map((exercise) => (
            <div key={exercise.id}>
              {exercise.id === 'basic-exercise' ? (
                <Link href="/exercise-player">
                  <ExerciseCard exercise={exercise} />
                </Link>
              ) : (
                <ExerciseCard exercise={exercise} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Popular */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-soft)]">Popular</h2>
        <div className="grid grid-cols-2 gap-3">
          {popularExercises.map((exercise) => (
            <div key={exercise.id}>
              {exercise.id === 'basic-exercise' ? (
                <Link href="/exercise-player">
                  <ExerciseCard exercise={exercise} />
                </Link>
              ) : (
                <ExerciseCard exercise={exercise} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Favorites (only show if user has favorites) */}
      {favoriteExercises.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-soft)]">Favorites</h2>
          <div className="grid grid-cols-2 gap-3">
            {favoriteExercises.map((exercise) => (
              <div key={exercise.id}>
                {exercise.id === 'basic-exercise' ? (
                  <Link href="/exercise-player">
                    <ExerciseCard exercise={exercise} />
                  </Link>
                ) : (
                  <ExerciseCard exercise={exercise} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
