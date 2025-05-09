import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bot, Image, Music, Video, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";

const Index = () => {
  const { toast } = useToast();

  // Features data
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

  // Pricing plans data
  const pricingPlans = [
    {
      name: "Free Trial",
      price: "Free",
      description: "Try once without signing up",
      features: ["One free generation", "Basic quality", "Standard processing speed"],
      buttonText: "Try Now",
      buttonVariant: "outline" as const,
      highlight: false,
      path: "#try-now"
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#2a2a40",
      color: `rgb(255, 255, 255)`,
    }}>
      <style>
        {`
          :root {
            --foreground-rgb: 255, 255, 255;
            --background-start-rgb: 0, 0, 0;
            --background-end-rgb: 0, 0, 0;
            --primary-glow: radial-gradient(rgba(1, 65, 255, 0.4), rgba(1, 65, 255, 0));
            --secondary-glow: linear-gradient(
              to bottom right,
              rgba(1, 65, 255, 0),
              rgba(1, 65, 255, 0),
              rgba(1, 65, 255, 0.3)
            );
            --primary: #0071ff;
            --primary-foreground: #ffffff;
            --secondary: #1e293b;
            --muted-foreground: #94a3b8;
            --card: #0f172a;
            --border: #1e293b;
            --violet-400: #c084fc;
            --cyan-300: #22d3ee;
          }

          /* Glow effect for buttons */
          .glow-button {
            transition: box-shadow 0.3s ease, filter 0.3s ease;
          }
          .glow-button:hover {
            box-shadow: 0 0 15px rgba(192, 132, 252, 0.5), 0 0 30px rgba(34, 211, 238, 0.3);
            filter: brightness(1.1);
          }

          /* Glow effect for feature cards */
          .glow-card {
            transition: box-shadow 0.3s ease, transform 0.3s ease;
          }
          .glow-card:hover {
            box-shadow: 0 0 20px rgba(192, 132, 252, 0.4), 0 0 40px rgba(34, 211, 238, 0.2);
            transform: translateY(-5px);
          }

          /* Glow effect for pricing cards */
          .glow-pricing-card {
            transition: box-shadow 0.3s ease, transform 0.3s ease;
          }
          .glow-pricing-card:hover {
            box-shadow: 0 0 25px rgba(192, 132, 252, 0.5), 0 0 50px rgba(34, 211, 238, 0.3);
            transform: translateY(-5px);
          }

          /* Glow effect for nav and footer links */
          .glow-link {
            position: relative;
            transition: color 0.3s ease;
          }
          .glow-link:hover {
            color: var(--cyan-300);
          }
          .glow-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(to right, var(--violet-400), var(--cyan-300));
            transition: width 0.3s ease;
          }
          .glow-link:hover::after {
            width: 100%;
          }
        `}
      </style>

      {/* Header/Navigation */}
      <header style={{
        padding: "1.5rem 0",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "rgba(var(--background-start-rgb), 0.95)",
        backdropFilter: "blur(4px)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link to="/" style={{
            fontSize: "1.5rem",
            lineHeight: "2rem",
            fontWeight: 700,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            backgroundImage: "linear-gradient(to right, var(--violet-400), var(--cyan-300))"
          }}>
            DorfNewAI
          </Link>
          
          <nav style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem"
          }}>
            <a href="#features" className="glow-link" style={{
              color: "var(--muted-foreground)",
              transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              Features
            </a>
            <a href="#pricing" className="glow-link" style={{
              color: "var(--muted-foreground)",
              transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              Pricing
            </a>
            <Button asChild size="sm" className="glow-button" style={{
              border: "1px solid var(--primary)",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem"
            }}>
              <a href="#try-now">Try for Free</a>
            </Button>
            <Button asChild size="sm" className="glow-button" style={{
              border: "1px solid var(--primary)",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem"
            }}>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </nav>
          
          <Button variant="ghost" style={{ display: "none" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </header>
      
      <main style={{ paddingTop: "6rem" }}>
        {/* Hero Section */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: "var(--secondary-glow)",
        }}>
          <div style={{
            position: "absolute",
            borderRadius: "100%",
            width: "500px",
            height: "500px",
            top: "-100px",
            left: "-100px",
            backgroundImage: "var(--primary-glow)",
            zIndex: -1
          }} />
          <div style={{
            position: "absolute",
            borderRadius: "100%",
            width: "400px",
            height: "400px",
            top: "30%",
            right: "-100px",
            backgroundImage: "var(--primary-glow)",
            zIndex: -1
          }} />
          
          <div style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1rem",
            paddingTop: "4rem",
            paddingBottom: "6rem",
            position: "relative",
            zIndex: 10
          }}>
            <div style={{
              maxWidth: "56rem",
              margin: "0 auto",
              textAlign: "center"
            }}>
              <h1 style={{
                fontSize: "2.25rem",
                lineHeight: "2.5rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
                letterSpacing: "-0.025em",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                backgroundImage: "linear-gradient(to right, var(--violet-400), var(--cyan-300))"
              }}>
                Create Stunning AI-Generated Content with DorfNewAI
              </h1>
              <p style={{
                fontSize: "1.25rem",
                lineHeight: "1.75rem",
                marginBottom: "2rem",
                color: "var(--muted-foreground)"
              }}>
                Unleash your creativity with our advanced AI tools. Generate impressive videos, images, and music in seconds.
              </p>
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                justifyContent: "center"
              }}>
                <Button asChild size="lg" className="glow-button" style={{
                  fontSize: "1.125rem",
                  padding: "1.5rem 2rem",
                  border: "1px solid var(--primary)",
                  borderRadius: "0.375rem"
                }}>
                  <a href="#try-now">Try for Free</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="glow-button" style={{
                  fontSize: "1.125rem",
                  padding: "1.5rem 2rem",
                  border: "1px solid var(--primary)",
                  borderRadius: "0.375rem"
                }}>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" style={{
          padding: "4rem 0",
          backgroundColor: "rgba(var(--secondary), 0.4)"
        }}>
          <div style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1rem"
          }}>
            <div style={{
              maxWidth: "48rem",
              margin: "0 auto 4rem",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "1.875rem",
                lineHeight: "2.25rem",
                fontWeight: 700,
                marginBottom: "1rem",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                backgroundImage: "linear-gradient(to right, var(--violet-400), var(--cyan-300))"
              }}>
                Experience the Power of DorfNewAI
              </h2>
              <p style={{
                fontSize: "1.125rem",
                color: "var(--muted-foreground)"
              }}>
                Our powerful AI tools help you create professional content in minutes, not hours
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "2rem"
            }}>
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="glow-card"
                  style={{
                    backgroundColor: "var(--card)",
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                    aspectRatio: "1/1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <div style={{
                    marginBottom: "1rem",
                    display: "inline-flex",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    backgroundColor: "rgba(var(--primary), 0.1)"
                  }}>
                    <feature.icon style={{ height: "1.5rem", width: "1.5rem", color: "var(--primary)" }} />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.5rem", color: "rgb(var(--foreground-rgb))" }}>{feature.title}</h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" style={{
          padding: "4rem 0",
          backgroundColor: "rgba(var(--secondary), 0.4)"
        }}>
          <div style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1rem"
          }}>
            <div style={{
              maxWidth: "48rem",
              margin: "0 auto 4rem",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "1.875rem",
                lineHeight: "2.25rem",
                fontWeight: 700,
                marginBottom: "1rem",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                backgroundImage: "linear-gradient(to right, var(--violet-400), var(--cyan-300))"
              }}>
                Simple, transparent pricing
              </h2>
              <p style={{
                fontSize: "1.125rem",
                color: "var(--muted-foreground)"
              }}>
                Choose the plan that works best for your needs
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "2rem",
              maxWidth: "64rem",
              margin: "0 auto"
            }}>
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="glow-pricing-card"
                  style={{
                    backgroundColor: "var(--card)",
                    padding: "2rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${plan.highlight ? "var(--primary)" : "var(--border)"}`,
                    boxShadow: plan.highlight ? "0 10px 15px -3px rgba(1, 65, 255, 0.2), 0 4px 6px -2px rgba(1, 65, 255, 0.1)" : "none",
                    position: "relative",
                    zIndex: plan.highlight ? 10 : "auto",
                    aspectRatio: "1/1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  {plan.highlight && (
                    <div style={{
                      position: "absolute",
                      top: "-0.75rem",
                      left: 0,
                      right: 0,
                      margin: "0 auto",
                      width: "fit-content",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderRadius: "9999px"
                    }}>
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.5rem", color: "rgb(var(--foreground-rgb))" }}>{plan.name}</h3>
                    <div style={{ marginBottom: "1rem" }}>
                      <span style={{ fontSize: "2rem", lineHeight: "2.5rem", fontWeight: 700, color: "rgb(var(--foreground-rgb))" }}>{plan.price}</span>
                    </div>
                    <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>{plan.description}</p>
                    <ul style={{ marginBottom: "1rem" }}>
                      {plan.features.map((feature) => (
                        <li key={feature} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", justifyContent: "center" }}>
                          <Check style={{ height: "1rem", width: "1rem", color: "var(--primary)", marginRight: "0.5rem", flexShrink: 0 }} />
                          <span style={{ fontSize: "0.75rem", color: "rgb(var(--foreground-rgb))" }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    asChild
                    variant={plan.buttonVariant}
                    className="glow-button"
                    style={{ width: "80%", backgroundColor: plan.highlight ? "var(--primary)" : "transparent", borderColor: "var(--primary)", fontSize: "0.875rem", padding: "0.5rem" }}
                    size="lg"
                  >
                    <a href={plan.path}>{plan.buttonText}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--card)" }}>
        <div style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1rem",
          paddingTop: "3rem",
          paddingBottom: "3rem"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            gap: "2rem"
          }}>
            <div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem", color: "rgb(var(--foreground-rgb))" }}>DorfNewAI</h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                Advanced AI tools for creating stunning videos, images, and music.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 500, marginBottom: "1rem", color: "rgb(var(--foreground-rgb))" }}>Product</h4>
              <ul style={{ gap: "0.5rem" }}>
                <li><a href="#features" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Features</a></li>
                <li><a href="#pricing" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Pricing</a></li>
                <li><a href="#try-now" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Try for Free</a></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 500, marginBottom: "1rem", color: "rgb(var(--foreground-rgb))" }}>Resources</h4>
              <ul style={{ gap: "0.5rem" }}>
                <li><Link to="/blog" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Blog</Link></li>
                <li><Link to="/tutorials" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Tutorials</Link></li>
                <li><Link to="/support" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 500, marginBottom: "1rem", color: "rgb(var(--foreground-rgb))" }}>Company</h4>
              <ul style={{ gap: "0.5rem" }}>
                <li><Link to="/about" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>About</Link></li>
                <li><Link to="/contact" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Contact</Link></li>
                <li><Link to="/privacy" className="glow-link" style={{
                  color: "var(--muted-foreground)",
                  transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}>Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div style={{
            borderTop: "1px solid var(--border)",
            marginTop: "3rem",
            paddingTop: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <p style={{
              color: "var(--muted-foreground)",
              fontSize: "0.875rem"
            }}>
              © 2025 DorfNewAI. All rights reserved.
            </p>
            <div style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "1rem"
            }}>
              <a href="#" className="glow-link" style={{
                color: "var(--muted-foreground)",
                transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>Twitter</span>
                <svg style={{ height: "1.5rem", width: "1.5rem", fill: "currentColor" }} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="glow-link" style={{
                color: "var(--muted-foreground)",
                transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1)"
              }}>
                <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: 0 }}>GitHub</span>
                <svg style={{ height: "1.5rem", width: "1.5rem", fill: "currentColor" }} viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705
                  .115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
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