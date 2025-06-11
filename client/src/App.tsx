import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNavigation from "@/components/BottomNavigation";
import Home from "@/pages/Home";
import Exercises from "@/pages/Exercises";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Switch>
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/home" component={Home} />
          <Route path="/exercises" component={Exercises} />
          <Route path="/progress" component={Progress} />
          <Route path="/profile" component={Profile} />
          <Route path="/" component={Home} />
        </Switch>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
