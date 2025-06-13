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
import Splash from "@/pages/Splash";
import UserFeedback from "@/pages/UserFeedback";
import AppRating from "@/pages/AppRating";
import Assessment from "@/pages/Assessment";
import TimePreference from "@/pages/TimePreference";
import NotificationPermission from "@/pages/NotificationPermission";
import PaywallModal from "@/pages/PaywallModal";
import ExercisePlayer from "@/pages/ExercisePlayer";
import ExerciseDetail from "@/pages/ExerciseDetail";
import ExerciseCompletion from "@/pages/ExerciseCompletion";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Switch>
        <Route path="/splash" component={Splash} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/feedback" component={UserFeedback} />
        <Route path="/rating" component={AppRating} />
        <Route path="/time-preference" component={TimePreference} />
        <Route path="/notifications" component={NotificationPermission} />
        <Route path="/paywall" component={PaywallModal} />
        <Route path="/exercise-player" component={ExercisePlayer} />
        <Route path="/exercise/:id" component={ExerciseDetail} />
        <Route path="/exercise-complete" component={ExerciseCompletion} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/home">
          <main className="flex-1 pb-20 overflow-y-auto">
            <Home />
          </main>
          <BottomNavigation />
        </Route>
        <Route path="/exercises">
          <main className="flex-1 pb-20 overflow-y-auto">
            <Exercises />
          </main>
          <BottomNavigation />
        </Route>
        <Route path="/progress">
          <main className="flex-1 pb-20 overflow-y-auto">
            <Progress />
          </main>
          <BottomNavigation />
        </Route>
        <Route path="/profile">
          <main className="flex-1 pb-20 overflow-y-auto">
            <Profile />
          </main>
          <BottomNavigation />
        </Route>
        <Route path="/">
          <main className="flex-1 pb-20 overflow-y-auto">
            <Home />
          </main>
          <BottomNavigation />
        </Route>
      </Switch>
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
