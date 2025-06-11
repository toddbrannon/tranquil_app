import { useEffect } from "react";
import { useLocation } from "wouter";
import { Heart } from "lucide-react";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
      <div className="text-center space-y-6 animate-pulse">
        <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto flex items-center justify-center shadow-lg">
          <Heart className="w-16 h-16 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-soft)] mb-2">TranquilApp</h1>
          <p className="text-[var(--text-muted)] text-lg">Your wellness journey begins</p>
        </div>
      </div>
    </div>
  );
}