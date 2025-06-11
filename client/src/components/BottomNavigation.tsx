import { useLocation } from "wouter";
import { Link } from "wouter";
import { Home, Heart, BarChart3, User } from "lucide-react";

const navigationItems = [
  {
    path: "/home",
    icon: Home,
    label: "Home",
  },
  {
    path: "/exercises",
    icon: Heart,
    label: "Exercises",
  },
  {
    path: "/progress",
    icon: BarChart3,
    label: "Progress",
  },
  {
    path: "/profile",
    icon: User,
    label: "Profile",
  },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex justify-around py-2">
        {navigationItems.map((item) => {
          const isActive = location === item.path || (location === "/" && item.path === "/home");
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button className="flex flex-col items-center py-2 px-4 transition-colors">
                <Icon 
                  className={`w-6 h-6 ${
                    isActive ? "text-primary" : "text-[var(--text-muted)]"
                  }`} 
                />
                <span 
                  className={`text-xs mt-1 ${
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
