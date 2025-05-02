
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="py-6 border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold ai-gradient-text">DorfNewAI</Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm">
              <Link to="/signup">Sign Up Free</Link>
            </Button>
          </nav>
          
          <Button variant="ghost" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </header>
      
      <main className="pt-24">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
