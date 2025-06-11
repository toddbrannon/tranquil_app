import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { X, Crown, Check, Star, Zap, Shield, Heart } from "lucide-react";

const premiumFeatures = [
  {
    icon: Star,
    title: "Unlimited Assessments",
    description: "Track your progress with unlimited wellness assessments"
  },
  {
    icon: Zap,
    title: "Advanced Analytics", 
    description: "Detailed insights and trends for your nervous system health"
  },
  {
    icon: Heart,
    title: "Premium Content",
    description: "Access to exclusive guided meditations and breathing exercises"
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get help faster with premium customer support"
  }
];

const pricingPlans = [
  {
    name: "Monthly",
    price: "$9.99",
    period: "/month",
    popular: false
  },
  {
    name: "Yearly", 
    price: "$59.99",
    period: "/year",
    popular: true,
    savings: "Save 50%"
  }
];

export default function PaywallModal() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("Yearly");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store premium status
    const premiumStatus = {
      isPremium: true,
      plan: selectedPlan,
      purchaseDate: new Date().toISOString()
    };
    localStorage.setItem('premiumStatus', JSON.stringify(premiumStatus));
    
    setIsProcessing(false);
    setLocation("/home");
  };

  const handleContinueFree = () => {
    // Store free status
    const premiumStatus = {
      isPremium: false,
      plan: "Free",
      declinedDate: new Date().toISOString()
    };
    localStorage.setItem('premiumStatus', JSON.stringify(premiumStatus));
    
    setLocation("/home");
  };

  const handleClose = () => {
    setLocation("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg bg-white/95 backdrop-blur-sm relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-soft)] mb-2">
                Upgrade to TranquilApp Premium
              </h1>
              <p className="text-[var(--text-muted)]">
                Unlock your full wellness potential
              </p>
            </div>

            {/* Pricing Plans */}
            <div className="space-y-3 mb-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.name
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-4 bg-primary text-white">
                      Most Popular
                    </Badge>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[var(--text-soft)]">{plan.name}</div>
                      {plan.savings && (
                        <div className="text-sm text-green-600 font-medium">{plan.savings}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[var(--text-soft)]">
                        {plan.price}
                      </div>
                      <div className="text-sm text-[var(--text-muted)]">
                        {plan.period}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <h3 className="font-semibold text-[var(--text-soft)]">Premium Benefits</h3>
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text-soft)] text-sm">
                        {feature.title}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base font-semibold"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  `Start Premium - ${pricingPlans.find(p => p.name === selectedPlan)?.price}`
                )}
              </Button>
              
              <Button
                onClick={handleContinueFree}
                variant="ghost"
                className="w-full text-[var(--text-muted)] hover:text-[var(--text-soft)]"
              >
                Continue with Free Version
              </Button>
            </div>

            {/* Fine print */}
            <p className="text-xs text-[var(--text-muted)] text-center mt-4 leading-relaxed">
              This is a simulated payment flow. No actual charges will be made. 
              Cancel anytime in your account settings.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}