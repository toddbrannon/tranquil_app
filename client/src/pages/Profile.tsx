import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Settings, HelpCircle, LogOut } from "lucide-react";

export default function Profile() {
  const user = {
    name: "Sarah Johnson",
    joinedDate: "Member since March 2024",
  };

  const settingsOptions = [
    {
      icon: Bell,
      label: "Notifications",
      action: () => console.log("Notifications"),
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => console.log("Settings"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => console.log("Help"),
    },
    {
      icon: LogOut,
      label: "Sign Out",
      action: () => console.log("Sign Out"),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card className="p-6 shadow-sm text-center">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" 
          alt="Profile avatar" 
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-[var(--text-soft)]">{user.name}</h2>
        <p className="text-[var(--text-muted)]">{user.joinedDate}</p>
      </Card>

      {/* Settings Options */}
      <div className="space-y-2">
        {settingsOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.label}
              variant="ghost"
              className="w-full justify-start h-auto p-0"
              onClick={option.action}
            >
              <Card className="w-full p-4 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-[var(--text-soft)]">{option.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
              </Card>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
