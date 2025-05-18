
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: {
        monthly: '$0',
        annually: '$0',
      },
      description: 'Perfect for beginners and hobbyists',
      features: [
        'Basic AI content generation',
        'Creator profile',
        'Up to 5 posts per month',
        'Community access',
      ],
      cta: 'Get Started',
      isPopular: false
    },
    {
      id: 'creator',
      name: 'Creator',
      price: {
        monthly: '$19',
        annually: '$15',
      },
      description: 'Ideal for growing creators',
      features: [
        'Advanced AI content tools',
        'Custom branding',
        'Unlimited posts',
        'Analytics dashboard',
        'Monetization tools',
      ],
      cta: 'Start 7-day Trial',
      isPopular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: {
        monthly: '$49',
        annually: '$39',
      },
      description: 'For established content creators',
      features: [
        'Everything in Creator',
        'Priority rendering',
        'API access',
        'Collaboration tools',
        'White-label options',
        'Dedicated support',
      ],
      cta: 'Start 7-day Trial',
      isPopular: false
    }
  ];
  
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dorfnew-primary/10 rounded-full blur-[150px] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent <span className="bg-gradient-primary bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-lg text-dorfnew-muted max-w-2xl mx-auto">
            Choose the plan that fits your creator journey
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <Label htmlFor="pricing-toggle" className={`text-sm ${!isAnnual ? 'text-white' : 'text-dorfnew-muted'}`}>
              Monthly
            </Label>
            <Switch
              id="pricing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-gradient-primary"
            />
            <Label htmlFor="pricing-toggle" className={`text-sm ${isAnnual ? 'text-white' : 'text-dorfnew-muted'}`}>
              Annually
              <span className="ml-2 bg-dorfnew-primary/20 text-dorfnew-primary text-xs py-0.5 px-2 rounded-full">
                Save 20%
              </span>
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-card p-8 relative ${
                plan.isPopular ? 'border-dorfnew-primary ring-2 ring-dorfnew-primary/20' : 'border-white/10'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-semibold py-1 px-3 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold">
                  {isAnnual ? plan.price.annually : plan.price.monthly}
                </span>
                <span className="text-dorfnew-muted ml-2">/month</span>
              </div>
              
              <p className="text-sm text-dorfnew-muted mb-6">
                {isAnnual && plan.id !== 'free' ? 'Billed annually' : plan.description}
              </p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <svg viewBox="0 0 24 24" width="18" height="18" className="text-dorfnew-primary mt-0.5 flex-shrink-0">
                      <path
                        fill="currentColor"
                        d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${
                  plan.isPopular
                    ? 'gradient-button'
                    : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-dorfnew-muted mb-4">
            Need a custom solution for your team?
          </p>
          <Button variant="outline" className="border-dorfnew-primary/50 text-dorfnew-muted hover:text-white hover:border-dorfnew-primary">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
