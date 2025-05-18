
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import SignUpDialog from './SignUpDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-dorfnew-background/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dorfnew
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-dorfnew-muted hover:text-white transition-colors">
            Features
          </a>
          <a href="#creators" className="text-dorfnew-muted hover:text-white transition-colors">
            For Creators
          </a>
          <a href="#pricing" className="text-dorfnew-muted hover:text-white transition-colors">
            Pricing
          </a>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="outline" 
            className="border-dorfnew-primary/50 text-dorfnew-muted hover:text-white hover:border-dorfnew-primary"
            onClick={() => console.log("Try Dorfnew clicked")}
          >
            Try Dorfnew
          </Button>
          <Button 
            className="gradient-button"
            onClick={() => setIsSignUpOpen(true)}
          >
            Sign Up
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dorfnew-background border-b border-white/10">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-dorfnew-muted hover:text-white py-2 transition-colors">
              Features
            </a>
            <a href="#creators" className="text-dorfnew-muted hover:text-white py-2 transition-colors">
              For Creators
            </a>
            <a href="#pricing" className="text-dorfnew-muted hover:text-white py-2 transition-colors">
              Pricing
            </a>
            <div className="flex flex-col gap-3 mt-2">
              <Button 
                variant="outline" 
                className="border-dorfnew-primary/50 text-dorfnew-muted hover:text-white hover:border-dorfnew-primary w-full"
                onClick={() => console.log("Try Dorfnew clicked")}
              >
                Try Dorfnew
              </Button>
              <Button 
                className="gradient-button w-full"
                onClick={() => setIsSignUpOpen(true)}
              >
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}

      <SignUpDialog 
        open={isSignUpOpen} 
        onOpenChange={setIsSignUpOpen} 
      />
    </header>
  );
};

export default Header;
