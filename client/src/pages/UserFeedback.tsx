import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { MessageSquare, ChevronRight } from "lucide-react";

const downloadReasons = [
  "Manage stress and anxiety",
  "Improve sleep quality", 
  "Learn about nervous system health",
  "Build healthy daily habits",
  "Recommended by healthcare provider",
  "Support mental wellness",
  "Other"
];

export default function UserFeedback() {
  const [, setLocation] = useLocation();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [inputMethod, setInputMethod] = useState<"dropdown" | "text">("dropdown");

  const handleContinue = () => {
    // Store the feedback in memory (simple state management for now)
    const feedback = {
      reason: selectedReason === "Other" ? customReason : selectedReason,
      timestamp: new Date().toISOString()
    };
    
    // Store in sessionStorage for temporary persistence within the session
    sessionStorage.setItem('userFeedback', JSON.stringify(feedback));
    
    setLocation("/rating");
  };

  const handleSkip = () => {
    setLocation("/rating");
  };

  const canContinue = selectedReason && (selectedReason !== "Other" || customReason.trim());

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
            Help Us Understand You Better
          </h1>
          
          <p className="text-[var(--text-muted)] mb-8">
            Why did you download TranquilApp? This helps us personalize your experience.
          </p>

          <div className="space-y-4 mb-8">
            {/* Toggle between dropdown and text input */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={inputMethod === "dropdown" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMethod("dropdown")}
                className="flex-1"
              >
                Quick Select
              </Button>
              <Button
                variant={inputMethod === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMethod("text")}
                className="flex-1"
              >
                Write Your Own
              </Button>
            </div>

            {inputMethod === "dropdown" ? (
              <div className="space-y-4">
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your main reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {downloadReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedReason === "Other" && (
                  <Textarea
                    placeholder="Please tell us more..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                )}
              </div>
            ) : (
              <Textarea
                placeholder="Tell us why you downloaded TranquilApp..."
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  setSelectedReason("custom");
                }}
                className="min-h-[120px]"
              />
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className="flex-1 bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}