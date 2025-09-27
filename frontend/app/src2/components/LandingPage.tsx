"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { Bot, Image, Music, Video, Check, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import styles from "../../../styles/landing.module.css";

const ThreeDBackground = () => {
  return (
    <div className={styles.absoluteInset}>
      <div className={`${styles.blurCircle} ${styles.blur1}`} />
      <div className={`${styles.blurCircle} ${styles.blur2}`} />
      <div className={`${styles.star} ${styles["star-1"]}`} />
      <div className={`${styles.star} ${styles["star-2"]}`} />
      <div className={`${styles.star} ${styles["star-3"]}`} />
      <div className={`${styles.star} ${styles["star-4"]}`} />
      <div className={`${styles.star} ${styles["star-5"]}`} />
      <div className={`${styles.star} ${styles["star-6"]}`} />
      <div className={`${styles.star} ${styles["star-7"]}`} />
      <div className={`${styles.star} ${styles["star-8"]}`} />
      <div className={`${styles.star} ${styles["star-9"]}`} />
      <div className={`${styles.star} ${styles["star-10"]}`} />
    </div>
  );
};

const LandingPageClient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (mode && oobCode) {
      if (mode === "resetPassword" || mode === "action") {
        verifyPasswordResetCode(auth, oobCode)
          .then((email) => {
            router.push(
              `/reset-password?oobCode=${oobCode}&email=${encodeURIComponent(
                email
              )}`
            );
          })
          .catch((error) => {
            console.error("Password reset verification error:", error);
            router.push(
              "/forgot-password?error=" +
                encodeURIComponent(
                  "Invalid or expired reset link. Please try again."
                )
            );
          });
      } else if (mode === "verifyEmail") {
        router.push(
          `/login?message=Email verification initiated&oobCode=${oobCode}`
        );
      } else {
        router.push("/login?error=invalid-action");
      }
    } else {
      setIsProcessing(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.gpteng.co/gptengineer.js";
    script.type = "module";
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (isProcessing) {
    return <div>Processing request...</div>;
  }

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
      features: [
        "One free generation",
        "Basic quality",
        "Standard processing speed",
      ],
      buttonText: "Try Now",
      buttonVariant: "outline" as const,
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
      buttonVariant: "default" as const,
      highlight: true,
      path: "/signup",
    },
    {
      name: "Pro",
      price: "Custom Pricing",
      description: "For API or business purposes",
      features: [
        "Dedicated account manager",
        "Custom AI model training",
      ],
      buttonText: "Sign Up",
      buttonVariant: "outline" as const,
      highlight: false,
      path: "/contact",
    },
  ];

  return (
    <div className={styles.minHScreen}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              DorfNewAI
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
              <a href="#features" className={styles.navLink}>
                Features
              </a>
              <a href="#pricing" className={styles.navLink}>
                Pricing
              </a>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={styles.icon} />
              ) : (
                <Menu className={styles.icon} />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={styles.mobileNav}>
              <nav className={styles.mobileNavContent}>
                <a href="#features" className={styles.navLink}>
                  Features
                </a>
                <a href="#pricing" className={styles.navLink}>
                  Pricing
                </a>
                <Button variant="outline" asChild className={styles.fullWidth}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className={styles.fullWidth}>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <ThreeDBackground />

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Create Stunning AI-Generated Content with DorfNewAI
            </h1>
            <p className={styles.heroSubtitle}>
              Unleash your creativity with our advanced AI tools. Generate
              impressive videos, images, and music in seconds.
            </p>
            <div className={styles.heroButtons}>
              <Button size="lg" asChild className={styles.primaryButton}>
                <Link href="/signup">Try for Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className={styles.secondaryButton}
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Experience the Power of DorfNewAI
              </h2>
              <p className={styles.sectionSubtitle}>
                Our powerful AI tools help you create professional content in
                minutes, not hours
              </p>
            </div>

            <div className={styles.featuresGrid}>
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.title} className={styles.featureCard}>
                    <div className={styles.featureIcon}>
                      <IconComponent className={styles.icon} />
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={styles.pricingSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Simple, transparent pricing</h2>
              <p className={styles.sectionSubtitle}>
                Choose the plan that works best for your needs
              </p>
            </div>

            <div className={styles.pricingGrid}>
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`${styles.pricingCard} ${
                    plan.highlight ? styles.highlightCard : ""
                  }`}
                >
                  {plan.highlight && (
                    <div className={styles.popularBadge}>Most Popular</div>
                  )}
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>{plan.price}</div>
                  <p className={styles.planDescription}>{plan.description}</p>
                  <ul className={styles.featuresList}>
                    {plan.features.map((feature) => (
                      <li key={feature} className={styles.featureItem}>
                        <Check className={styles.checkIcon} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.buttonVariant}
                    asChild
                    className={styles.fullWidth}
                  >
                    <Link href={plan.path}>{plan.buttonText}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerTitle}>DorfNewAI</h3>
              <p className={styles.footerDescription}>
                Advanced AI tools for creating stunning videos, images, and
                music.
              </p>
            </div>
            <div>
              <h4 className={styles.footerHeading}>Product</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#features" className={styles.footerLink}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className={styles.footerLink}>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#try-now" className={styles.footerLink}>
                    Try for Free
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Resources</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="/support" className={styles.footerLink}>Support</Link></li>
                <li><Link href="/faq" className={styles.footerLink}>FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className={styles.footerHeading}>Company</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/about" className={styles.footerLink}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={styles.footerLink}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={styles.footerLink}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © 2025 DorfNewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageClient;
