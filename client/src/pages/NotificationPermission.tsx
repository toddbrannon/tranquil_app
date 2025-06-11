import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Bell, BellOff, Check, X, Smartphone } from "lucide-react";

export default function NotificationPermission() {
  const [, setLocation] = useLocation();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAllow = () => {
    // Simulate notification permission request
    setPermissionGranted(true);
    setShowResult(true);
    
    // Store permission status
    const notificationPreference = {
      permission: 'granted',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('notificationPermission', JSON.stringify(notificationPreference));
    
    // Auto-proceed after showing result
    setTimeout(() => {
      setLocation("/home");
    }, 2000);
  };

  const handleDeny = () => {
    setPermissionGranted(false);
    setShowResult(true);
    
    // Store permission status
    const notificationPreference = {
      permission: 'denied',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('notificationPermission', JSON.stringify(notificationPreference));
    
    // Auto-proceed after showing result
    setTimeout(() => {
      setLocation("/home");
    }, 2000);
  };

  const handleSkip = () => {
    setLocation("/home");
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm">
            <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
              permissionGranted 
                ? "bg-green-100" 
                : "bg-orange-100"
            }`}>
              {permissionGranted ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <BellOff className="w-8 h-8 text-orange-600" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
              {permissionGranted ? "Notifications Enabled!" : "No Problem!"}
            </h1>
            
            <p className="text-[var(--text-muted)] mb-6">
              {permissionGranted 
                ? "We'll send you gentle reminders to help you maintain your wellness routine. You can change this anytime in settings."
                : "You can still use TranquilApp fully. You can enable notifications later in your device settings if you change your mind."
              }
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
              <div className="animate-spin w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"></div>
              Taking you to the app...
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
            Allow Notifications?
          </h1>
          
          <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
            TranquilApp would like to send you gentle reminders for your wellness practices. We'll only send helpful notifications at your preferred time.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Smartphone className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="text-sm font-medium text-green-800">Daily Wellness Reminders</div>
                <div className="text-xs text-green-600">Gentle nudges at your chosen time</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Check className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="text-sm font-medium text-blue-800">Progress Celebrations</div>
                <div className="text-xs text-blue-600">Celebrate your wellness milestones</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAllow}
              className="w-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Allow Notifications
            </Button>
            
            <Button
              onClick={handleDeny}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Don't Allow
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-[var(--text-muted)]"
            >
              Skip for Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}