
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free Trial",
    price: "Free",
    description: "Try once without signing up",
    features: ["One free generation", "Basic quality", "Standard processing speed"],
    buttonText: "Try Now",
    buttonVariant: "outline" as const,
    highlight: false,
    path: "/try-now"
  },
  {
    name: "Standard",
    price: "$10/mo",
    description: "Perfect for individual creators",
    features: [
      "Unlimited generations",
      "HD quality output",
      "Priority processing",
      "Access to all AI models",
      "Save history for 30 days",
    ],
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    highlight: true,
    path: "/signup"
  },
  {
    name: "Pro",
    price: "$25/mo",
    description: "For professional content creators",
    features: [
      "Everything in Standard",
      "4K quality output",
      "Express processing",
      "Advanced editing tools",
      "Commercial usage rights",
      "Dedicated support",
    ],
    buttonText: "Sign Up",
    buttonVariant: "outline" as const,
    highlight: false,
    path: "/signup"
  },
];

export function Pricing() {
  return (
    <div id="pricing" className="py-16 md:py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that works best for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card p-8 rounded-lg border ${
                plan.highlight
                  ? "border-primary shadow-lg shadow-primary/20 relative z-10"
                  : "border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.buttonVariant}
                className="w-full"
                size="lg"
              >
                <Link to={plan.path}>{plan.buttonText}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
