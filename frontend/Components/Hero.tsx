
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SignUpDialog from './SignUpDialog';

const Hero = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  
  return (
    <section className="pt-16 pb-24 relative overflow-hidden">
      {/* Gradient background elements */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-dorfnew-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-dorfnew-secondary/20 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Ultimate <span className="bg-gradient-primary bg-clip-text text-transparent">Content Creation</span> Platform
            </h1>
            
            <p className="text-xl text-dorfnew-muted mb-8 max-w-2xl mx-auto lg:mx-0">
              Generate professional AI-powered content, build your audience, and monetize your creativity in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="gradient-button text-lg py-6 px-8"
                onClick={() => setIsSignUpOpen(true)}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                className="text-lg py-6 border-dorfnew-primary/50 text-dorfnew-muted hover:text-white hover:border-dorfnew-primary"
                onClick={() => console.log("Try Dorfnew clicked")}
              >
                Try Dorfnew
              </Button>
            </div>
            
            <div className="mt-8 text-dorfnew-muted flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-dorfnew-background"></div>
                ))}
              </div>
              <span>Join over 10,000+ content creators</span>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="flex-1 relative">
            <div className="aspect-[4/3] w-full md:max-w-md lg:max-w-lg mx-auto">
              <div className="glass-card w-full h-full p-6 animate-float">
                <div className="relative w-full h-full bg-gradient-to-br from-dorfnew-primary/20 to-dorfnew-secondary/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center animate-pulse-glow">
                        <svg viewBox="0 0 24 24" width="24" height="24" className="text-white">
                          <path
                            fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                          />
                        </svg>
                      </div>
                      <p className="mt-4 text-white font-medium">AI-powered content generation</p>
                      <p className="text-sm text-dorfnew-muted mt-2">Click to explore features</p>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 h-12 glass-card flex items-center justify-between px-4">
                    <span className="text-dorfnew-muted text-sm">dorfnew.com/creator/studio</span>
                    <div className="h-6 w-6 rounded-full bg-gradient-primary"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 glass-card p-3 rounded-lg animate-float">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary"></div>
                <div>
                  <p className="text-xs font-medium">New subscriber!</p>
                  <p className="text-xs text-dorfnew-muted">Just now</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-2 glass-card p-3 rounded-lg animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex gap-2 items-center">
                <svg viewBox="0 0 24 24" width="16" height="16" className="text-green-500">
                  <path
                    fill="currentColor"
                    d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                  />
                </svg>
                <p className="text-xs font-medium">AI generation complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SignUpDialog 
        open={isSignUpOpen} 
        onOpenChange={setIsSignUpOpen} 
      />
    </section>
  );
};

export default Hero;
