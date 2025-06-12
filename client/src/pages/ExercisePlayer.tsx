import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Play, Pause, SkipForward, X, Volume2 } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  audioUrl: string;
  backgroundImage: string;
  instructor: string;
}

// Simulated exercise data
const basicExercise: Exercise = {
  id: "basic-breathing",
  title: "The Basic Exercise",
  duration: 300, // 5 minutes
  description: "A gentle introduction to nervous system regulation through mindful breathing",
  audioUrl: "/audio/basic-breathing.mp3", // This would be a real audio file
  backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  instructor: "Dr. Sarah Chen"
};

export default function ExercisePlayer() {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercise = basicExercise;
  const progress = (currentTime / exercise.duration) * 100;

  // Simulate audio playback since we don't have real audio files
  useEffect(() => {
    if (isPlaying && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= exercise.duration) {
            setIsPlaying(false);
            setIsCompleted(true);
            return exercise.duration;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isCompleted, exercise.duration]);

  const togglePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setCurrentTime(exercise.duration);
    setIsPlaying(false);
    setIsCompleted(true);
  };

  const handleComplete = () => {
    // Store completion data
    const completionData = {
      exerciseId: exercise.id,
      completedAt: new Date().toISOString(),
      duration: currentTime,
      completed: isCompleted
    };
    
    const existingCompletions = JSON.parse(localStorage.getItem('exerciseCompletions') || '[]');
    existingCompletions.push(completionData);
    localStorage.setItem('exerciseCompletions', JSON.stringify(existingCompletions));

    setLocation("/home");
  };

  const handleClose = () => {
    setLocation("/exercises");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10">
        <div 
          className="flex-1 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${exercise.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-6 text-center">
            <Card className="max-w-md w-full p-8 bg-white/95 backdrop-blur-sm shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
                Exercise Complete!
              </h1>
              
              <p className="text-[var(--text-muted)] mb-6">
                Great work! You've completed "{exercise.title}" and taken an important step in your wellness journey.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Time spent:</span>
                  <span className="font-medium text-[var(--text-soft)]">{formatTime(currentTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Exercise:</span>
                  <span className="font-medium text-[var(--text-soft)]">{exercise.title}</span>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Continue
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Close
        </Button>
        <h1 className="font-semibold text-[var(--text-soft)]">{exercise.title}</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="flex items-center gap-2"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </Button>
      </div>

      {/* Background Image */}
      <div 
        className="flex-1 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${exercise.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-6">
          {!hasStarted ? (
            <Card className="max-w-md w-full p-8 text-center bg-white/90 backdrop-blur-sm shadow-lg">
              <h2 className="text-xl font-bold text-[var(--text-soft)] mb-4">
                {exercise.title}
              </h2>
              
              <p className="text-[var(--text-muted)] mb-6 leading-relaxed">
                {exercise.description}
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Duration:</span>
                  <span className="font-medium text-[var(--text-soft)]">{formatTime(exercise.duration)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Instructor:</span>
                  <span className="font-medium text-[var(--text-soft)]">{exercise.instructor}</span>
                </div>
              </div>

              <Button
                onClick={togglePlayPause}
                className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-semibold flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start Exercise
              </Button>
            </Card>
          ) : (
            <Card className="max-w-md w-full p-6 bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-soft)] mb-2">
                  {exercise.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Follow along with the guided exercise
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">{formatTime(currentTime)}</span>
                  <span className="text-[var(--text-muted)]">{formatTime(exercise.duration)}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex justify-center">
                <Button
                  onClick={togglePlayPause}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Simulated audio element (hidden) */}
      <audio
        ref={audioRef}
        src={exercise.audioUrl}
        onEnded={() => {
          setIsPlaying(false);
          setIsCompleted(true);
        }}
        className="hidden"
      />
    </div>
  );
}