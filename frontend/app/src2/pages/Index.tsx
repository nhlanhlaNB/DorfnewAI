"use client";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { Bot, Image, Music, Video, Check } from "lucide-react";
import { useEffect } from "react";
import styles from './Index.module.css';

const Index = () => {
  const features = [
    {
      title: "AI Video Creation",
      description: "Generate stunning videos from text prompts or image uploads.",
      icon: Video,
    },
    {
      title: "AI Image Generation",
      description: "Create beautiful artwork and graphics with our advanced image models.",
      icon: Image,
    },
    {
      title: "AI Music Production",
      description: "Compose original music tracks with our AI-powered music generator.",
      icon: Music,
    },
    {
      title: "Smart Content Prompting",
      description: "Get guidance on creating the perfect prompts for optimal results.",
      icon: Bot,
    },
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "Free",
      description: "Try once without signing up",
      features: ["One free generation", "Basic quality", "Standard processing speed"],
      buttonText: "Try Now",
      buttonVariant: "outline",
      highlight: false,
      path: "/signup",
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
      buttonVariant: "default",
      highlight: true,
      path: "/signup",
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
      buttonVariant: "outline",
      highlight: false,
      path: "/signup",
    },
  ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.gpteng.co/gptengineer.js";
    script.type = "module";
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            DorfNewAI
          </Link>
          <nav className={styles.nav}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <Link href="/login" className={styles.signInButton}>Sign In</Link>
            <Link href="/signup" className={styles.signUpButton}>Sign Up</Link>
          </nav>
        </div>
      </header>
      <main>
        <div className={styles.hero}>
          <div className={styles.heroGradient1} />
          <div className={styles.heroGradient2} />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Create Stunning AI-Generated Content with DorfNewAI
            </h1>
            <p className={styles.heroSubtitle}>
              Unleash your creativity with our advanced AI tools. Generate impressive videos, images, and music in seconds.
            </p>
            <div className={styles.heroButtonGroup}>
              <a href="/signup" className={styles.heroPrimaryButton}>
                Try for Free
              </a>
              <Link href="/signup" className={styles.heroSecondaryButton}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div id="features" className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Experience the Power of DorfNewAI
            </h2>
            <p className={styles.sectionSubtitle}>
              Our powerful AI tools help you create professional content in minutes, not hours
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIconContainer}>
                  <feature.icon style={{ color: "#9b87f5" }} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="pricing" className={styles.pricingSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Simple, transparent pricing
            </h2>
            <p className={styles.sectionSubtitle}>Choose the plan that works best for your needs</p>
          </div>
          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name} 
                className={`${styles.pricingCard} ${plan.highlight ? styles.highlightCard : ''}`}
              >
                {plan.highlight && (
                  <div className={styles.highlightBadge}>
                    Most Popular
                  </div>
                )}
                <h3 className={styles.pricingPlanName}>{plan.name}</h3>
                <div className={styles.pricingPlanPrice}>{plan.price}</div>
                <p className={styles.pricingPlanDescription}>{plan.description}</p>
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.pricingFeatureItem}>
                      <Check className={styles.pricingFeatureCheck} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.path}
                  className={`${styles.pricingButton} ${
                    plan.buttonVariant === "outline" 
                      ? styles.pricingButtonOutline 
                      : styles.pricingButtonDefault
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumns}>
            <div>
              <h3 className={styles.footerTitle}>DorfNewAI</h3>
              <p className={styles.footerDescription}>
                Advanced AI tools for creating stunning videos, images, and music.
              </p>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Product</h4>
              <ul className={styles.footerList}>
                <li className={styles.footerListItem}><a href="#features" className={styles.footerLink}>Features</a></li>
                <li className={styles.footerListItem}><a href="#pricing" className={styles.footerLink}>Pricing</a></li>
                <li className={styles.footerListItem}><a href="#try-now" className={styles.footerLink}>Try for Free</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Resources</h4>
              <ul className={styles.footerList}>
                <li className={styles.footerListItem}><Link href="/blog" className={styles.footerLink}>Blog</Link></li>
                <li className={styles.footerListItem}><Link href="/tutorials" className={styles.footerLink}>Tutorials</Link></li>
                <li className={styles.footerListItem}><Link href="/support" className={styles.footerLink}>Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Company</h4>
              <ul className={styles.footerList}>
                <li className={styles.footerListItem}><Link href="/about" className={styles.footerLink}>About</Link></li>
                <li className={styles.footerListItem}><Link href="/contact" className={styles.footerLink}>Contact</Link></li>
                <li className={styles.footerListItem}><Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>© 2025 DorfNewAI. All rights reserved.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg style={{ height: "1.5rem", width: "1.5rem", fill: "currentColor" }} viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="GitHub">
                <svg style={{ height: "1.5rem", width: "1.5rem", fill: "currentColor" }} viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;