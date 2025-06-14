"use client";
import { Button } from "@/../../app/src2/components/ui/button";
import Link from "next/link";
import { Bot, Image, Music, Video, Check } from "lucide-react";
import { useEffect } from "react";

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
      path: "/signup", // Updated path
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
      path: "/signup", // Updated path
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
      path: "/signup", // Updated path
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
    <div style={{ minHeight: "100vh", background: "#2a2a40", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "rgba(26, 26, 48, 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #2a2a40" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: 700, background: "linear-gradient(to right, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", color: "transparent" }}>
            DorfNewAI
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <a href="#features" style={{ color: "#94a3b8", transition: "color 0.3s ease" }}>Features</a>
            <a href="#pricing" style={{ color: "#94a3b8", transition: "color 0.3s ease" }}>Pricing</a>
            <Link href="/login" style={{ padding: "0.5rem 1rem", borderRadius: "0.375rem", border: "1px solid #9b87f5", color: "#9b87f5", transition: "all 0.3s ease" }}>Sign In</Link>
            <Link href="/signup" style={{ padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: "#9b87f5", color: "#fff", transition: "all 0.3s ease" }}>Sign Up</Link>
          </nav>
        </div>
      </header>
      <main>
        <div style={{ position: "relative", overflow: "hidden", paddingTop: "120px", paddingBottom: "4rem", background: "linear-gradient(to bottom right, rgba(155, 135, 245, 0), rgba(155, 135, 245, 0.3))" }}>
          <div style={{ position: "absolute", width: "500px", height: "500px", top: "-100px", left: "-100px", borderRadius: "100%", opacity: 0.7, filter: "blur(100px)", background: "radial-gradient(rgba(155, 135, 245, 0.4), rgba(155, 135, 245, 0))", zIndex: -1 }} />
          <div style={{ position: "absolute", width: "400px", height: "400px", top: "30%", right: "-100px", borderRadius: "100%", opacity: 0.7, filter: "blur(100px)", background: "radial-gradient(rgba(155, 135, 245, 0.4), rgba(155, 135, 245, 0))", zIndex: -1 }} />
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.5rem", background: "linear-gradient(to right, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", color: "transparent" }}>
              Create Stunning AI-Generated Content with DorfNewAI
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "2rem" }}>
              Unleash your creativity with our advanced AI tools. Generate impressive videos, images, and music in seconds.
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center" }}>
              <a href="/signup" style={{ padding: "0.75rem 2rem", borderRadius: "0.375rem", backgroundColor: "#9b87f5", color: "#fff", fontSize: "1.125rem", transition: "all 0.3s ease", width: "100%", textAlign: "center" }}>
                Try for Free
              </a>
              <Link href="/signup" style={{ padding: "0.75rem 2rem", borderRadius: "0.375rem", border: "1px solid #9b87f5", color: "#9b87f5", fontSize: "1.125rem", transition: "all 0.3s ease", width: "100%", textAlign: "center" }}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div id="features" style={{ padding: "4rem 0", backgroundColor: "rgba(30, 41, 59, 0.3)" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem", padding: "0 1rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem", background: "linear-gradient(to right, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", color: "transparent" }}>
              Experience the Power of DorfNewAI
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#94a3b8" }}>
              Our powerful AI tools help you create professional content in minutes, not hours
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            {features.map((feature) => (
              <div key={feature.title} style={{ backgroundColor: "#1a1a2e", padding: "1.5rem", borderRadius: "0.375rem", border: "1px solid #2a2a40", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transition: "all 0.3s ease" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: "48px", width: "48px", borderRadius: "0.375rem", backgroundColor: "rgba(155, 135, 245, 0.1)", marginBottom: "1rem" }}>
                  <feature.icon style={{ color: "#9b87f5" }} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.5rem" }}>{feature.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="pricing" style={{ padding: "4rem 0", backgroundColor: "rgba(15, 23, 42, 0.3)" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem", padding: "0 1rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem", background: "linear-gradient(to right, #c084fc, #22d3ee)", WebkitBackgroundClip: "text", color: "transparent" }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#94a3b8" }}>Choose the plan that works best for your needs</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: "1024px", margin: "0 auto", padding: "0 1rem" }}>
            {pricingPlans.map((plan) => (
              <div key={plan.name} style={{ backgroundColor: "#1a1a2e", padding: "2rem", borderRadius: "0.375rem", border: `1px solid ${plan.highlight ? "#9b87f5" : "#2a2a40"}`, position: "relative", textAlign: "center", display: "flex", flexDirection: "column", transition: "all 0.3s ease" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#9b87f5", color: "#fff", fontSize: "0.75rem", fontWeight: 500, padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.5rem" }}>{plan.name}</h3>
                <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{plan.price}</div>
                <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{plan.description}</p>
                <ul style={{ listStyle: "none", textAlign: "left", marginBottom: "2rem", flexGrow: 1 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                      <Check style={{ color: "#9b87f5", marginRight: "0.5rem", flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.path} style={{ padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: plan.buttonVariant === "outline" ? "transparent" : "#9b87f5", color: plan.buttonVariant === "outline" ? "#9b87f5" : "#fff", border: plan.buttonVariant === "outline" ? "1px solid #9b87f5" : "none", transition: "all 0.3s ease", width: "100%", textAlign: "center" }}>
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer style={{ borderTop: "1px solid #2a2a40", backgroundColor: "#0f172a", padding: "4rem 0 2rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", marginBottom: "3rem" }}>
            <div>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>DorfNewAI</h3>
              <p style={{ color: "#94a3b8", marginBottom: "1rem", fontSize: "0.875rem" }}>
                Advanced AI tools for creating stunning videos, images, and music.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>Product</h4>
              <ul style={{ listStyle: "none" }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="#features" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Features</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#pricing" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Pricing</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#try-now" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Try for Free</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>Resources</h4>
              <ul style={{ listStyle: "none" }}>
                <li style={{ marginBottom: "0.5rem" }}><Link href="/blog" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Blog</Link></li>
                <li style={{ marginBottom: "0.5rem" }}><Link href="/tutorials" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Tutorials</Link></li>
                <li style={{ marginBottom: "0.5rem" }}><Link href="/support" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: "1rem", fontSize: "1.125rem" }}>Company</h4>
              <ul style={{ listStyle: "none" }}>
                <li style={{ marginBottom: "0.5rem" }}><Link href="/about" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>About</Link></li>
                <li style={{ marginBottom: "0.5rem" }}><Link href="/contact" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Contact</Link></li>
                <li style={{ marginBottom: "0.5rem" }}><Link href="/privacy" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #2a2a40", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>© 2025 DorfNewAI. All rights reserved.</p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <a href="#" style={{ color: "#94a3b8" }}>
                <svg style={{ height: "1.5rem", width: "1.5rem", fill: "currentColor" }} viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" style={{ color: "#94a3b8" }}>
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