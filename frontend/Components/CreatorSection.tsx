
import { Button } from '@/components/ui/button';

const CreatorSection = () => {
  return (
    <section id="creators" className="py-24 relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-dorfnew-secondary/10 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image side */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="relative">
              <div className="glass-card p-6 rounded-xl relative z-10 max-w-lg mx-auto">
                <div className="h-64 lg:h-80 bg-gradient-to-br from-dorfnew-primary/30 to-dorfnew-secondary/30 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4">
                      <svg viewBox="0 0 24 24" width="28" height="28" className="text-white">
                        <path
                          fill="currentColor"
                          d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Creator Profile</h3>
                    <p className="text-dorfnew-muted">Customize your brand identity and connect with your audience</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <p className="text-sm text-dorfnew-muted">Digital Creator</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-primary"></div>
                    <div className="w-7 h-7 rounded-full bg-gradient-primary-reverse"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 right-12 glass-card p-3 rounded-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="18" height="18" className="text-white">
                      <path
                        fill="currentColor"
                        d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile Verified</p>
                    <p className="text-xs text-dorfnew-muted">Premium Creator</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 left-10 glass-card p-3 rounded-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-primary border-2 border-dorfnew-background"></div>
                    ))}
                  </div>
                  <p className="text-xs font-medium">5.2k followers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text side */}
          <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Build Your Creator <span className="bg-gradient-primary bg-clip-text text-transparent">Empire</span>
            </h2>
            <p className="text-lg text-dorfnew-muted mb-8 max-w-lg mx-auto lg:mx-0">
              Showcase your talent, connect with fans, and build a sustainable income with our comprehensive creator tools.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-lg mx-auto lg:mx-0">
              {[
                "Customizable creator profiles",
                "Content scheduling tools",
                "Fan engagement features",
                "Multiple monetization options"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" width="14" height="14" className="text-white">
                      <path
                        fill="currentColor"
                        d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                      />
                    </svg>
                  </div>
                  <span className="text-dorfnew-muted">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button className="gradient-button">Start Creating Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorSection;
