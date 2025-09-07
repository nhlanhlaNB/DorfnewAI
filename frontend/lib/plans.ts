// frontend/lib/plans.ts

export interface Plan {
  title: string;
  price: string;
  description: string;
  features: string[];
  paypalPlanId: string;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    title: "Basic",
    price: "$10",
    description:
      "Ideal for hobbyist creators who want to unlock the full potential of the platform.",
    features: [
      "Unlimited generations",
      "HD quality output",
      "Priority processing",
      "Access to all AI models",
      "Save history for 30 days",
    ],
    paypalPlanId: "P-4SW2058640943662UNBTJI6Y",
  },
  {
    title: "Premium",
    price: "$25",
    description:
      "Great for families or small groups, with shared access for up to 4 members.",
    features: [
      "Everything in Standard",
      "4K quality output",
      "Express processing",
      "Advanced editing tools",
      "Commercial usage rights",
      "Dedicated support",
    ],
    paypalPlanId: "P-3CS59433TT1532629NBT25SQ",
    popular: true,
  },
];
