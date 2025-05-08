import { Button } from "@/app/landing/components/ui/button";
import Link from "next/link";
import { Bot, Image, Music, Video, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/landing/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/landing/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/landing/components/ui/select";
import { Label } from "@/app/landing/components/ui/label";
import { Textarea } from "@/app/landing/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/app/landing/components/ui/use-toast";
import "@/styles/landing.module.css";

const Index = () => {
  // State for TryNow section
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("image");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Digital Content Creator",
      quote: "DorfNewAI has completely transformed my workflow. I can create videos and images in minutes that used to take me hours.",
      avatar: "SJ",
    },
    {
      name: "Marcus Chen",
      title: "Indie Game Developer",
      quote: "The music generation capabilities are incredible. I've saved thousands on custom soundtracks for my games.",
      avatar: "MC",
    },
    {
      name: "Priya Patel",
      title: "Marketing Director",
      quote: "Our marketing team relies on DorfNewAI daily. The speed and quality of content generation gives us a competitive edge.",
      avatar: "PP",
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
      path: "#try-now",
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
      path: "/signup",
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast({
        title: "Please enter a prompt",
        description: "You need to provide a description of what you want to create.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // In a real app, you would call your backend API here
      console.log("Generating content:", { prompt, contentType });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate a result
      const mockResults: Record<string, string> = {
        image: "https://source.unsplash.com/random/600x400",
        video: "https://example.com/video.mp4",
        music: "https://example.com/music.mp3",
      };

      setResult(mockResults[contentType]);

      toast({
        title: "Content generated!",
        description: "Sign up to unlock unlimited generations.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="py-6 border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold ai-gradient-text">
            DorfNewAI
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#try-now" className="text-muted-foreground hover:text-foreground transition-colors">
              Try Now
            </a>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </nav>

          <Button variant="ghost" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background blur elements */}
          <div
            className="blur-circle bg-purple-700 w-[500px] h-[500px] -top-[100px] -left-[100px]"
            style={{ zIndex: -1 }}
          />
          <div
            className="blur-circle bg-indigo-500 w-[400px] h-[400px] top-[30%] -right-[100px]"
            style={{ zIndex: -1 }}
          />

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight ai-gradient-text">
                Create Stunning AI-Generated Content with DorfNewAI
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                Unleash your creativity with our advanced AI tools. Generate impressive videos, images, and music in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg py-6 px-8">
                  <a href="#try-now">Try for Free</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16 md:py-24 bg-secondary/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
                Experience the Power of DorfNewAI
              </h2>
              <p className="text-lg text-muted-foreground">
                Our powerful AI tools help you create professional content in minutes, not hours
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="mb-4 inline-flex p-3 rounded-md bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
                Loved by Creators Everywhere
              </h2>
              <p className="text-lg text-muted-foreground">
                See what our users are saying about DorfNewAI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-card p-8 rounded-lg border border-border relative"
                >
                  <div className="mb-6">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="italic mb-6 text-muted-foreground">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
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
                  <Button asChild variant={plan.buttonVariant} className="w-full" size="lg">
                    <Link href={plan.path}>{plan.buttonText}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Try Now Section */}
        <div id="try-now" className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
                Try DorfNewAI For Free
              </h2>
              <p className="text-lg text-muted-foreground">
                Generate one piece of content without signing up
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="w-full">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Create Your Content</CardTitle>
                  <CardDescription>
                    Create one AI-generated piece of content without signing up
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Describe what you want to create</Label>
                      <Textarea
                        id="prompt"
                        placeholder="E.g., A futuristic cityscape at sunset with flying cars"
                        rows={5}
                        value={prompt}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Generating..." : "Generate Now"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground text-center w-full">
                    This is a one-time free trial. <Link href="/signup" className="text-primary hover:underline">Sign up</Link> for unlimited access.
                  </p>
                </CardFooter>
              </Card>

              <Card className="w-full flex-1">
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-muted-foreground">Generating your content...</p>
                    </div>
                  ) : result ? (
                    <div className="flex flex-col items-center space-y-4">
                      {contentType === "image" ? (
                        <img
                          src={result}
                          alt="AI-generated content"
                          className="w-full h-auto max-h-[400px] object-contain rounded-md"
                        />
                      ) : (
                        <div className="bg-secondary/50 w-full h-48 flex items-center justify-center rounded-md">
                          <p>Content generated! (Preview not available in demo)</p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="mb-4">Like what you see? Sign up for unlimited generations!</p>
                        <Button asChild>
                          <Link href="/signup">Create Account</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
                      <p className="text-muted-foreground">Fill out the form and click Generate to see your AI creation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">DorfNewAI</h3>
              <p className="text-muted-foreground mb-4">
                Advanced AI tools for creating stunning videos, images, and music.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#try-now" className="text-muted-foreground hover:text-primary transition-colors">
                    Try for Free
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-muted-foreground hover:text-primary transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 DorfNewAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
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