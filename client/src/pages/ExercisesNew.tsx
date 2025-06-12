import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Lock } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import exercisesData from "@/data/exercises.json";

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
}

export default function Exercises() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const filters = ["All", "Move", "Breathe", "Meditate"];

  // Filter exercises by category
  const filteredExercises = activeFilter === "All" 
    ? exercisesData.exercises 
    : exercisesData.exercises.filter((exercise: Exercise) => 
        exercise.category.toLowerCase() === activeFilter.toLowerCase()
      );

  // Group exercises by section
  const exercisesBySection = filteredExercises.reduce((acc: Record<string, Exercise[]>, exercise: Exercise) => {
    if (!acc[exercise.section]) {
      acc[exercise.section] = [];
    }
    acc[exercise.section].push(exercise);
    return acc;
  }, {});

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

  // Exercise Card Component
  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <Link href={`/exercise/${exercise.id}`}>
      <Card className="shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
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
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
              {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
            </span>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-soft)] text-sm">{exercise.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{exercise.description}</p>
              <div className="flex items-center mt-2 text-xs text-[var(--text-muted)]">
                <Clock className="w-3 h-3 mr-1" />
                <span>{exercise.duration} min</span>
                <span className="mx-2">•</span>
                <span>{exercise.instructor}</span>
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
    </Link>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-soft)]">Exercises</h1>
        <p className="text-[var(--text-muted)] mt-1">Discover guided practices for your wellness journey</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={filter === activeFilter ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Exercise Sections */}
      <div className="space-y-6">
        {Object.entries(exercisesBySection).map(([section, exercises]) => (
          <div key={section} className="space-y-3">
            <h2 className="text-lg font-semibold text-[var(--text-soft)]">
              {getSectionTitle(section)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.map((exercise: Exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(exercisesBySection).length === 0 && (
        <div className="text-center py-12">
          <div className="text-[var(--text-muted)] mb-4">
            No exercises found for "{activeFilter}"
          </div>
          <Button 
            variant="outline" 
            onClick={() => setActiveFilter("All")}
          >
            Show All Exercises
          </Button>
        </div>
      )}
    </div>
  );
}