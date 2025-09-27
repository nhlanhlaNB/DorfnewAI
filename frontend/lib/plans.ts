// frontend/lib/plans.ts
export interface Plan {
  title: string;
  price: string;
  description: string;
  features: string[];
  paypalPlanId: string;
  seats?: number;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    title: "Standard",
    price: "$10",
    description: "Ideal for hobbyist creators who want to unlock the full potential of the platform.",
    features: [
      "Unlimited generations",
      "HD quality output",
      "Priority processing",
      "Access to all AI models",
      "Save history for 30 days",
    ],
    paypalPlanId: "P-4SW2058640943662UNBTJI6Y",
    seats: 1,
    popular: true,
  },
];

