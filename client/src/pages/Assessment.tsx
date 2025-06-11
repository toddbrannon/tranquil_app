import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Share2, RotateCcw, Brain, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  type: "slider" | "radio";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  weight: number; // For scoring calculation
}

interface QuizResult {
  id: string;
  score: number;
  answers: Record<number, number>;
  completedAt: string;
  category: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by daily stress?",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    weight: 1.2
  },
  {
    id: 2,
    question: "How well do you sleep at night?",
    type: "radio",
    options: ["Very poorly", "Poorly", "Fair", "Well", "Very well"],
    weight: 1.1
  },
  {
    id: 3,
    question: "Rate your current anxiety levels (0 = none, 10 = severe)",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    weight: 1.3
  },
  {
    id: 4,
    question: "How often do you practice mindfulness or meditation?",
    type: "radio",
    options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
    weight: 0.9
  },
  {
    id: 5,
    question: "Rate your energy levels throughout the day (0 = very low, 10 = very high)",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    weight: 1.0
  },
  {
    id: 6,
    question: "How well do you handle unexpected changes?",
    type: "radio",
    options: ["Very poorly", "Poorly", "Moderately", "Well", "Very well"],
    weight: 1.1
  },
  {
    id: 7,
    question: "Rate your ability to focus and concentrate (0 = very poor, 10 = excellent)",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    weight: 1.0
  },
  {
    id: 8,
    question: "How often do you experience physical tension or pain?",
    type: "radio",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    weight: 1.2
  },
  {
    id: 9,
    question: "Rate your overall mood stability (0 = very unstable, 10 = very stable)",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    weight: 1.1
  },
  {
    id: 10,
    question: "How confident do you feel about managing stress?",
    type: "radio",
    options: ["Not confident at all", "Slightly confident", "Moderately confident", "Very confident", "Extremely confident"],
    weight: 1.0
  }
];

// Local storage simulation with CRUD operations
const quizStorage = {
  save: (result: QuizResult): void => {
    const results = quizStorage.getAll();
    results.push(result);
    localStorage.setItem('quiz_results', JSON.stringify(results));
  },
  
  getAll: (): QuizResult[] => {
    const stored = localStorage.getItem('quiz_results');
    return stored ? JSON.parse(stored) : [];
  },
  
  getById: (id: string): QuizResult | null => {
    const results = quizStorage.getAll();
    return results.find(r => r.id === id) || null;
  },
  
  update: (id: string, updates: Partial<QuizResult>): void => {
    const results = quizStorage.getAll();
    const index = results.findIndex(r => r.id === id);
    if (index !== -1) {
      results[index] = { ...results[index], ...updates };
      localStorage.setItem('quiz_results', JSON.stringify(results));
    }
  },
  
  delete: (id: string): void => {
    const results = quizStorage.getAll().filter(r => r.id !== id);
    localStorage.setItem('quiz_results', JSON.stringify(results));
  }
};

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [resultCategory, setResultCategory] = useState("");
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const calculateScore = (): number => {
    let totalScore = 0;
    let totalWeight = 0;

    quizQuestions.forEach(q => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        let normalizedScore: number;
        
        if (q.type === "slider") {
          // For sliders, higher values are better for positive questions
          // But some questions need to be inverted (stress, anxiety)
          if (q.id === 1 || q.id === 3 || q.id === 8) {
            // Invert these scores (higher = worse)
            normalizedScore = ((q.max! - answer) / q.max!) * 10;
          } else {
            // Normal scoring (higher = better)
            normalizedScore = (answer / q.max!) * 10;
          }
        } else {
          // For radio buttons, index represents quality (0 = worst, 4 = best)
          // But some need to be inverted
          if (q.id === 8) {
            // "How often do you experience tension" - reverse scoring
            normalizedScore = ((q.options!.length - 1 - answer) / (q.options!.length - 1)) * 10;
          } else {
            normalizedScore = (answer / (q.options!.length - 1)) * 10;
          }
        }
        
        totalScore += normalizedScore * q.weight;
        totalWeight += q.weight;
      }
    });

    return Math.round((totalScore / totalWeight) * 10); // Scale to 0-100
  };

  const getScoreCategory = (score: number): string => {
    if (score >= 80) return "Excellent Regulation";
    if (score >= 65) return "Good Regulation";
    if (score >= 50) return "Moderate Regulation";
    if (score >= 35) return "Needs Attention";
    return "Significant Dysregulation";
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    const score = calculateScore();
    const category = getScoreCategory(score);
    
    setFinalScore(score);
    setResultCategory(category);
    setIsCompleted(true);

    // Save result to local storage
    const result: QuizResult = {
      id: Date.now().toString(),
      score,
      answers,
      completedAt: new Date().toISOString(),
      category
    };
    
    quizStorage.save(result);
  };

  const shareScore = () => {
    // Simulate social sharing
    const shareText = `I just completed a nervous system assessment and scored ${finalScore}/100 (${resultCategory}) on TranquilApp! 🧠✨`;
    
    // Copy to clipboard as simulation
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Score copied to clipboard!",
        description: "Share text is ready to paste on social media",
      });
    });
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setFinalScore(0);
    setResultCategory("");
  };

  const isAnswered = answers[question.id] !== undefined;
  const allAnswered = quizQuestions.every(q => answers[q.id] !== undefined);

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-4">
              Assessment Complete
            </h1>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {finalScore}/100
              </div>
              <div className="text-lg font-medium text-[var(--text-soft)] mb-2">
                {resultCategory}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${finalScore}%` }}
                />
              </div>
            </div>

            <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
              {finalScore >= 80 && "Your nervous system shows excellent regulation. Keep up the great work with your wellness practices!"}
              {finalScore >= 65 && finalScore < 80 && "You have good nervous system regulation with room for improvement. Consider incorporating more mindfulness practices."}
              {finalScore >= 50 && finalScore < 65 && "Your nervous system regulation is moderate. Regular practice could help you feel more balanced."}
              {finalScore >= 35 && finalScore < 50 && "Your nervous system may need attention. Consider exploring breathing exercises and stress management techniques."}
              {finalScore < 35 && "Your assessment suggests significant dysregulation. Consider consulting with a healthcare provider and using daily wellness practices."}
            </p>

            <div className="flex gap-3 mb-4">
              <Button
                onClick={shareScore}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Score
              </Button>
              <Button
                onClick={retakeQuiz}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </Button>
            </div>

            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              className="w-full"
            >
              Back to App
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-[var(--text-soft)]">Nervous System Assessment</h1>
          <span className="text-sm text-[var(--text-muted)]">
            {currentQuestion + 1} of {quizQuestions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--text-soft)] mb-6 leading-relaxed">
              {question.question}
            </h2>

            {question.type === "slider" ? (
              <div className="space-y-4">
                <Slider
                  value={[answers[question.id] || question.min!]}
                  onValueChange={(value) => handleAnswer(value[0])}
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>{question.min}</span>
                  <span className="font-medium text-primary">
                    {answers[question.id] !== undefined ? answers[question.id] : question.min}
                  </span>
                  <span>{question.max}</span>
                </div>
              </div>
            ) : (
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) => handleAnswer(parseInt(value))}
                className="space-y-3"
              >
                {question.options!.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="text-[var(--text-soft)] cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!isAnswered}
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              {currentQuestion === quizQuestions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}