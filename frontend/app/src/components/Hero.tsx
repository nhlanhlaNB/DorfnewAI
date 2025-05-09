
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
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
              <Link to="/try-now">Try for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg py-6 px-8">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
