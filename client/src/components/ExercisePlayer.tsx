import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";

interface Exercise {
  id: string;
  title: string;
  duration: number;
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

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

export default function ExercisePlayer({ exercise, onComplete, onClose }: ExercisePlayerProps) {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = () => {
    console.log('Exercise completion triggered for:', exercise.id);
    
    // Store completion data temporarily for the completion screen
    const completionData = {
      exerciseId: exercise.id,
      duration: exercise.duration
    };
    localStorage.setItem('tempCompletionData', JSON.stringify(completionData));
    console.log('Stored completion data:', completionData);
    
    // Navigate to completion screen
    console.log('Navigating to completion screen...');
    setLocation('/exercise-complete');
    onComplete();
  };

  // Simulate progress for different formats
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          // Speed up for testing: complete in 10 seconds instead of full duration
          const increment = 100 / 10; // Complete in 10 seconds for testing
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            setIsPlaying(false);
            // Use setTimeout to ensure state updates complete before navigation
            setTimeout(() => {
              handleComplete();
            }, 100);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, exercise.duration, onComplete]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    if (exercise.format === 'slideshow' && exercise.slides) {
      setCurrentSlide(Math.min(currentSlide + 1, exercise.slides.length - 1));
    }
    setProgress(Math.min(progress + 10, 100));
  };

  const skipToEnd = () => {
    setProgress(100);
    setIsPlaying(false);
    handleComplete();
  };

  const skipBack = () => {
    if (exercise.format === 'slideshow' && exercise.slides) {
      setCurrentSlide(Math.max(currentSlide - 1, 0));
    }
    setProgress(Math.max(progress - 10, 0));
  };

  const renderContent = () => {
    switch (exercise.format) {
      case 'audio-only':
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Volume2 className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-soft)] mb-2">Audio Guidance</h3>
              <p className="text-[var(--text-muted)]">Close your eyes and follow the guided instructions</p>
            </div>
            {exercise.steps && (
              <Card className="p-4 text-left">
                <h4 className="font-medium text-[var(--text-soft)] mb-2">Steps to Follow:</h4>
                <ul className="space-y-1 text-sm text-[var(--text-muted)]">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className={`flex items-start gap-2 ${currentStep === index ? 'text-primary font-medium' : ''}`}>
                      <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs mt-0.5">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        );

      case 'audio-animation':
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <div className={`w-24 h-24 bg-primary/20 rounded-full ${isPlaying ? 'animate-pulse' : ''}`}>
                  <div className="w-full h-full bg-primary/30 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
              {isPlaying && (
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-soft)] mb-2">Guided Movement</h3>
              <p className="text-[var(--text-muted)]">Follow the visual cues and audio guidance</p>
            </div>
            {exercise.steps && (
              <Card className="p-4 text-left">
                <h4 className="font-medium text-[var(--text-soft)] mb-2">Movement Steps:</h4>
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className={`flex items-start gap-2 ${Math.floor((progress / 100) * exercise.steps!.length) === index ? 'text-primary font-medium' : ''}`}>
                      <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs mt-0.5">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Play className="w-16 h-16 text-white mx-auto" />
                <p className="text-white">Video Player Simulation</p>
                <p className="text-white/70 text-sm">Real video would play here</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[var(--text-soft)] mb-2">Video Exercise</h3>
              <p className="text-[var(--text-muted)]">Follow along with the demonstrated movements</p>
            </div>
          </div>
        );

      case 'slideshow':
        if (!exercise.slides) return null;
        const currentSlideData = exercise.slides[currentSlide];
        return (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={currentSlideData.image} 
                alt={currentSlideData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {currentSlide + 1} / {exercise.slides.length}
              </div>
            </div>
            <Card className="p-4 text-center">
              <h3 className="text-lg font-semibold text-[var(--text-soft)] mb-2">
                {currentSlideData.title}
              </h3>
              <p className="text-[var(--text-muted)]">{currentSlideData.text}</p>
            </Card>
          </div>
        );

      default:
        return <div>Unsupported format</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[var(--text-muted)]">
          <span>{Math.floor((progress / 100) * exercise.duration)} min</span>
          <span>{exercise.duration} min</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={skipBack}
          disabled={exercise.format === 'slideshow' && currentSlide === 0}
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        
        <Button
          size="lg"
          onClick={togglePlayPause}
          className="w-16 h-16 rounded-full"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 fill-current" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={skipForward}
          disabled={exercise.format === 'slideshow' && exercise.slides && currentSlide === exercise.slides.length - 1}
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button onClick={skipToEnd} className="flex-1">
          Complete Exercise
        </Button>
      </div>
    </div>
  );
}