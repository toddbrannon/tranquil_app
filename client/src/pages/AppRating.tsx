import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Star, Heart, Sparkles } from "lucide-react";

export default function AppRating() {
  const [, setLocation] = useLocation();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setHasRated(true);
    
    // Store rating in memory
    const ratingData = {
      rating: selectedRating,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('userRating', JSON.stringify(ratingData));
  };

  const handleContinue = () => {
    setLocation("/time-preference");
  };

  const handleSkip = () => {
    setLocation("/time-preference");
  };

  const getRatingMessage = (stars: number) => {
    switch (stars) {
      case 1:
        return "We'll work harder to improve your experience";
      case 2:
        return "Thanks for the feedback, we're always improving";
      case 3:
        return "Good to know! We'll keep making TranquilApp better";
      case 4:
        return "Great! We're glad you're enjoying the app";
      case 5:
        return "Amazing! Thank you for the love ❤️";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm">
          {!hasRated ? (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
                Rate Your Experience
              </h1>
              
              <p className="text-[var(--text-muted)] mb-8">
                How would you rate TranquilApp so far? Your feedback helps us create a better wellness experience.
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {hoveredRating > 0 && (
                <p className="text-sm text-[var(--text-muted)] mb-6 h-6">
                  {hoveredRating} star{hoveredRating !== 1 ? 's' : ''}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600 fill-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
                Thank You!
              </h1>
              
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-[var(--text-muted)] mb-8">
                {getRatingMessage(rating)}
              </p>
            </>
          )}

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
            >
              {hasRated ? "Done" : "Skip"}
            </Button>
            {hasRated && (
              <Button
                onClick={handleContinue}
                className="flex-1 bg-primary text-white hover:bg-primary/90"
              >
                Start Using App
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}