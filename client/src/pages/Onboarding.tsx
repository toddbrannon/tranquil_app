import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/home");
  };

  return (
    <div className="p-4 flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
          <Heart className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-soft)]">Welcome to TranquilApp</h1>
        <p className="text-[var(--text-muted)] max-w-sm mx-auto">
          Your personal wellness companion for meditation, mindfulness, and peaceful living.
        </p>
        <Button 
          onClick={handleGetStarted}
          className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
