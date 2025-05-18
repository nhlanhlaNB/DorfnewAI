
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SignUpDialog from './SignUpDialog';

const CTA = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dorfnew-background via-dorfnew-background to-dorfnew-primary/20 -z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dorfnew-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dorfnew-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your <span className="bg-gradient-primary bg-clip-text text-transparent">Creative Journey</span>?
          </h2>
          <p className="text-xl text-dorfnew-muted mb-10 max-w-2xl mx-auto">
            Join thousands of creators already using Dorfnew to produce amazing content and build their audience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="gradient-button text-lg py-6 px-10"
              onClick={() => setIsSignUpOpen(true)}
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              className="border-dorfnew-primary/50 text-dorfnew-muted hover:text-white hover:border-dorfnew-primary text-lg py-6 px-10"
              onClick={() => console.log("Try Dorfnew clicked")}
            >
              Try Dorfnew
            </Button>
          </div>
          
          <p className="text-sm text-dorfnew-muted mt-6">
            No credit card required. Free plan available.
          </p>
        </div>
      </div>
      
      <SignUpDialog 
        open={isSignUpOpen} 
        onOpenChange={setIsSignUpOpen} 
      />
    </section>
  );
};

export default CTA;
