import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Brain, Zap, Heart, Shield, Target } from "lucide-react";
import { useLocation } from "wouter";
import { useDrag } from "@use-gesture/react";

const onboardingSlides = [
  {
    id: 1,
    title: "Understanding Your Nervous System",
    description: "Your nervous system is like your body's electrical network, constantly sending signals between your brain and body to keep you safe and functioning.",
    icon: Brain,
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    id: 2,
    title: "What is Dysregulation?",
    description: "Nervous system dysregulation happens when this network becomes overwhelmed, stuck in survival mode, affecting your emotions, thoughts, and physical sensations.",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-600"
  },
  {
    id: 3,
    title: "Signs You Might Notice",
    description: "You might experience anxiety, difficulty sleeping, feeling overwhelmed, racing thoughts, or physical tension. These are your nervous system's way of trying to protect you.",
    icon: Heart,
    color: "bg-red-500/10 text-red-600"
  },
  {
    id: 4,
    title: "The Path to Regulation",
    description: "Through gentle practices like breathing exercises, mindfulness, and body awareness, you can help your nervous system find balance and calm.",
    icon: Shield,
    color: "bg-green-500/10 text-green-600"
  },
  {
    id: 5,
    title: "Your Journey Starts Here",
    description: "TranquilApp provides tools and guidance to help you understand and regulate your nervous system, creating more peace and resilience in your daily life.",
    icon: Target,
    color: "bg-primary/10 text-primary"
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGetStarted = () => {
    setLocation("/home");
  };

  // Swipe gesture handling
  const bind = useDrag(
    ({ direction: [dx], distance, cancel }) => {
      if (distance > 50) {
        if (dx > 0 && currentSlide > 0) {
          prevSlide();
        } else if (dx < 0 && currentSlide < onboardingSlides.length - 1) {
          nextSlide();
        }
        cancel();
      }
    },
    {
      axis: 'x',
      bounds: { left: -100, right: 100, top: 0, bottom: 0 },
      rubberband: true,
    }
  );

  const slide = onboardingSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10">
      {/* Progress Indicator */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex space-x-2">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card 
          {...bind()}
          className="max-w-sm w-full p-8 text-center shadow-lg bg-white/80 backdrop-blur-sm touch-pan-y select-none"
          style={{ touchAction: 'pan-y' }}
        >
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${slide.color}`}>
            <Icon className="w-12 h-12" />
          </div>
          
          <h2 className="text-xl font-bold text-[var(--text-soft)] mb-4">
            {slide.title}
          </h2>
          
          <p className="text-[var(--text-muted)] leading-relaxed mb-8">
            {slide.description}
          </p>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <span className="text-sm text-[var(--text-muted)]">
              {currentSlide + 1} of {onboardingSlides.length}
            </span>

            {currentSlide < onboardingSlides.length - 1 ? (
              <Button
                size="sm"
                onClick={nextSlide}
                className="flex items-center space-x-1 bg-primary text-white hover:bg-primary/90"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleGetStarted}
                className="bg-primary text-white hover:bg-primary/90 px-6"
              >
                Get Started
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Skip Option */}
      <div className="text-center pb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGetStarted}
          className="text-[var(--text-muted)] hover:text-[var(--text-soft)]"
        >
          Skip Introduction
        </Button>
      </div>
    </div>
  );
}
