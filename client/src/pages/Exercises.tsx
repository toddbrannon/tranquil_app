import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Lock } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import exercisesData from "@/data/exercises.json";

export default function Exercises() {
  const categories = ["All", "Meditation", "Breathing", "Sleep"];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-soft)]">Exercises</h1>
        <Button variant="ghost" className="text-primary font-medium">
          Filter
        </Button>
      </div>
      
      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={index === 0 ? "default" : "outline"}
            size="sm"
            className={`whitespace-nowrap ${
              index === 0 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "bg-white text-[var(--text-soft)] shadow-sm"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Exercise */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[var(--text-soft)]">Featured for You</h2>
        <Link href="/exercise-player">
          <Card className="shadow-sm overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-md transition-shadow cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
              alt="The Basic Exercise" 
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--text-soft)]">The Basic Exercise</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                      <Star className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Try First</span>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Perfect introduction to nervous system regulation</p>
                  <div className="flex items-center mt-2 text-xs text-[var(--text-muted)]">
                    <span>5 min</span>
                    <span className="mx-2">•</span>
                    <span>Beginner</span>
                    <span className="mx-2">•</span>
                    <span>Dr. Sarah Chen</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  className="w-10 h-10 bg-primary/20 hover:bg-primary/30 text-primary"
                  variant="ghost"
                >
                  <Play className="w-5 h-5 fill-current" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        <h2 className="font-semibold text-[var(--text-soft)]">More Exercises</h2>
        
        <Card className="shadow-sm overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
            alt="Meditation exercise" 
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-soft)]">Mindful Breathing</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Reduce stress with guided breathing</p>
                <div className="flex items-center mt-2 text-xs text-[var(--text-muted)]">
                  <span>10 min</span>
                  <span className="mx-2">•</span>
                  <span>Beginner</span>
                </div>
              </div>
              <Button
                size="icon"
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary"
                variant="ghost"
              >
                <Play className="w-5 h-5 fill-current" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
            alt="Sleep meditation" 
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-soft)]">Sleep Stories</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Peaceful stories for better sleep</p>
                <div className="flex items-center mt-2 text-xs text-[var(--text-muted)]">
                  <span>15 min</span>
                  <span className="mx-2">•</span>
                  <span>All levels</span>
                </div>
              </div>
              <Button
                size="icon"
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary"
                variant="ghost"
              >
                <Play className="w-5 h-5 fill-current" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
