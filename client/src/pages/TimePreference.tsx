import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Clock, Bell, ChevronRight } from "lucide-react";

interface TimePreference {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  displayTime: string;
}

export default function TimePreference() {
  const [, setLocation] = useLocation();
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");
  
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const handleContinue = () => {
    if (!selectedHour) return;

    const timePreference: TimePreference = {
      hour: parseInt(selectedHour),
      minute: parseInt(selectedMinute),
      period: selectedPeriod as 'AM' | 'PM',
      displayTime: `${selectedHour}:${selectedMinute} ${selectedPeriod}`
    };

    // Store in sessionStorage and localStorage for persistence
    sessionStorage.setItem('timePreference', JSON.stringify(timePreference));
    localStorage.setItem('userTimePreference', JSON.stringify(timePreference));

    setLocation("/notifications");
  };

  const handleSkip = () => {
    setLocation("/notifications");
  };

  const canContinue = selectedHour !== "";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
            When Would You Like to Use TranquilApp?
          </h1>
          
          <p className="text-[var(--text-muted)] mb-8">
            Choose your preferred time for daily wellness practices. We can send you gentle reminders to help build healthy habits.
          </p>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-sm text-[var(--text-soft)]">Hour</Label>
                <Select value={selectedHour} onValueChange={setSelectedHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-[var(--text-soft)]">Minute</Label>
                <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-[var(--text-soft)]">Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {canContinue && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium text-lg">
                    {selectedHour}:{selectedMinute} {selectedPeriod}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Your preferred time for wellness practices
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--text-soft)]">Popular Times</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedHour("07");
                    setSelectedMinute("00");
                    setSelectedPeriod("AM");
                  }}
                  className="text-xs"
                >
                  Morning (7:00 AM)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedHour("12");
                    setSelectedMinute("00");
                    setSelectedPeriod("PM");
                  }}
                  className="text-xs"
                >
                  Lunch (12:00 PM)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedHour("06");
                    setSelectedMinute("00");
                    setSelectedPeriod("PM");
                  }}
                  className="text-xs"
                >
                  Evening (6:00 PM)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedHour("09");
                    setSelectedMinute("00");
                    setSelectedPeriod("PM");
                  }}
                  className="text-xs"
                >
                  Bedtime (9:00 PM)
                </Button>
              </div>
            </div>
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