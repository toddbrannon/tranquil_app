import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Clock, User, Lock, Star, Heart, Volume2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useEffect } from "react";
import exercisesData from "@/data/exercises.json";
import ExercisePlayer from "@/components/ExercisePlayer";
import { favoritesManager } from "@/lib/favorites";

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
  audioUrl?: string;
  videoUrl?: string;
  animationType?: string;
  slides?: Array<{
    image: string;
    title: string;
    text: string;
  }>;
  steps?: string[];
}

export default function ExerciseDetail() {
  const { id } = useParams();
  const exercise = exercisesData.exercises.find((ex: Exercise) => ex.id === id) as Exercise;
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (exercise) {
      setIsFavorite(favoritesManager.isFavorite(exercise.id));
    }
  }, [exercise]);

  const handleToggleFavorite = () => {
    if (exercise) {
      const newFavoriteStatus = favoritesManager.toggleFavorite({
        id: exercise.id,
        title: exercise.title,
        duration: exercise.duration,
        instructor: exercise.instructor,
        backgroundImage: exercise.backgroundImage
      });
      setIsFavorite(newFavoriteStatus);
    }
  };

  const handleStartExercise = () => {
    if (exercise.isPremium) return; // Block premium exercises
    setShowPlayer(true);
  };

  const handleCompleteExercise = () => {
    // Store completion data temporarily for the completion screen
    localStorage.setItem('tempCompletionData', JSON.stringify({
      exerciseId: exercise.id,
      duration: exercise.duration
    }));
    
    setShowPlayer(false);
    // Navigate to completion screen
    window.location.href = '/exercise-complete';
  };

  if (!exercise) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-muted)]">Exercise not found</h2>
        <Link href="/exercises">
          <Button className="mt-4">Back to Exercises</Button>
        </Link>
      </div>
    );
  }

  if (showPlayer) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-[var(--text-soft)]">{exercise.title}</h1>
            <p className="text-[var(--text-muted)]">{exercise.instructor}</p>
          </div>
          <ExercisePlayer 
            exercise={exercise}
            onComplete={handleCompleteExercise}
            onClose={() => setShowPlayer(false)}
          />
        </div>
      </div>
    );
  }

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'release-tension': return 'Release Tension';
      case 'vagus-nerve': return 'Vagus Nerve Activation';
      case 'deep-restore': return 'Deep Restore';
      default: return section;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'move': return 'bg-blue-100 text-blue-800';
      case 'breathe': return 'bg-green-100 text-green-800';
      case 'meditate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="relative">
        <img 
          src={exercise.backgroundImage} 
          alt={exercise.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <Link href="/exercises">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        {/* Premium Badge and Favorite Button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          {exercise.isPremium && (
            <div className="bg-black/70 rounded-full px-3 py-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-white" />
              <span className="text-xs font-medium text-white">Premium</span>
            </div>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
              {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
            </span>
            <span className="text-white/80 text-sm">
              {getSectionTitle(exercise.section)}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{exercise.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-white/90">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{exercise.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="text-sm">{exercise.instructor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Play Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="w-full max-w-sm" 
            disabled={exercise.isPremium}
            onClick={handleStartExercise}
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            {exercise.isPremium ? 'Premium Required' : 'Start Exercise'}
          </Button>
        </div>

        {/* Format Information */}
        <Card className="p-4">
          <h2 className="font-semibold text-[var(--text-soft)] mb-2">Exercise Format</h2>
          <div className="flex items-center gap-2">
            {exercise.format === 'audio-only' && (
              <>
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-[var(--text-muted)]">Audio-only guidance</span>
              </>
            )}
            {exercise.format === 'audio-animation' && (
              <>
                <Play className="w-4 h-4 text-primary" />
                <span className="text-[var(--text-muted)]">Audio with animated guidance</span>
              </>
            )}
            {exercise.format === 'video' && (
              <>
                <Play className="w-4 h-4 text-primary" />
                <span className="text-[var(--text-muted)]">Video demonstration</span>
              </>
            )}
            {exercise.format === 'slideshow' && (
              <>
                <Star className="w-4 h-4 text-primary" />
                <span className="text-[var(--text-muted)]">Interactive slideshow</span>
              </>
            )}
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4">
          <h2 className="font-semibold text-[var(--text-soft)] mb-2">About This Exercise</h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {exercise.description}
          </p>
        </Card>

        {/* Techniques */}
        <Card className="p-4">
          <h2 className="font-semibold text-[var(--text-soft)] mb-3">What You'll Learn</h2>
          <div className="space-y-2">
            {exercise.techniques.map((technique, index) => (
              <div key={index} className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-[var(--text-muted)]">{technique}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Instructor */}
        <Card className="p-4">
          <h2 className="font-semibold text-[var(--text-soft)] mb-2">Instructor</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-medium text-[var(--text-soft)]">{exercise.instructor}</div>
              <div className="text-sm text-[var(--text-muted)]">Wellness Expert</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}