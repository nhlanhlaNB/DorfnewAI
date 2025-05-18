
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpDialog = ({ open, onOpenChange }: SignUpDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    toast.success("Sign up successful! Check your email for verification.");
    onOpenChange(false);
  };
  
  const handleGoogleSignUp = () => {
    // Implement Google Sign Up here
    toast.info("Google sign-in integration would be implemented here");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Join Dorfnew
          </DialogTitle>
          <DialogDescription className="text-center text-dorfnew-muted">
            Create your account to start creating amazing content
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-3 border border-white/20 bg-white/5 hover:bg-white/10"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" className="text-white">
              <path
                fill="currentColor"
                d="M12 22q-2.05 0-3.9-.788-1.85-.787-3.175-2.137-1.325-1.35-2.087-3.175Q2 14.075 2 12q0-2.075.788-3.9.787-1.825 2.137-3.175 1.35-1.35 3.175-2.1Q9.925 2 12 2q2.05 0 3.887.787 1.838.788 3.163 2.138 1.325 1.35 2.087 3.175Q22 9.925 22 12v1.45q0 1.475-1.012 2.513Q19.975 17 18.5 17q-1.125 0-2.037-.675-.913-.675-1.213-1.75-.525.675-1.25 1.05Q13.275 16 12.35 16q-1.875 0-3.188-1.312Q7.85 13.375 7.85 11.5q0-1.875 1.312-3.188Q10.475 7 12.35 7q1.875 0 3.188 1.312Q16.85 9.625 16.85 11.5v1.45q0 .725.45 1.137.45.413 1.2.413.75 0 1.2-.413.45-.412.45-1.137V12q0-3.35-2.325-5.675Q15.5 4 12.15 4 8.775 4 6.387 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20h4q.425 0 .713.288.287.287.287.712t-.287.712Q16.425 22 16 22h-4ZM12.35 14q1.05 0 1.75-.725.7-.725.7-1.775 0-1.05-.7-1.775-.7-.725-1.75-.725-1.05 0-1.775.725-.725.725-.725 1.775 0 1.05.725 1.775.725.725 1.775.725Z"
              />
            </svg>
            Continue with Google
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-sm text-dorfnew-muted">or</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-dorfnew-muted/70"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="bg-white/10 border-white/20 text-white placeholder:text-dorfnew-muted/70"
                required
              />
            </div>
            
            <Button type="submit" className="w-full gradient-button">
              Create Account
            </Button>
          </form>
          
          <p className="text-xs text-center text-dorfnew-muted">
            By signing up, you agree to our {" "}
            <a href="#" className="underline hover:text-white">Terms of Service</a> and {" "}
            <a href="#" className="underline hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
