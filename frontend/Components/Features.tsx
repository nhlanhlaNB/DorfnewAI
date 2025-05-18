
import { Button } from '@/components/ui/button';

const Features = () => {
  const featureCards = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" className="text-dorfnew-primary">
          <path
            fill="currentColor"
            d="M17,22V20H20V17H22V20.5C22,20.89 21.84,21.24 21.54,21.54C21.24,21.84 20.89,22 20.5,22H17M7,22H3.5C3.11,22 2.76,21.84 2.46,21.54C2.16,21.24 2,20.89 2,20.5V17H4V20H7V22M17,2H20.5C20.89,2 21.24,2.16 21.54,2.46C21.84,2.76 22,3.11 22,3.5V7H20V4H17V2M7,2V4H4V7H2V3.5C2,3.11 2.16,2.76 2.46,2.46C2.76,2.16 3.11,2 3.5,2H7M13,17.25C13,17.38 12.94,17.5 12.83,17.6C12.72,17.71 12.59,17.76 12.45,17.76C12.31,17.76 12.19,17.71 12.08,17.6C11.97,17.5 11.92,17.38 11.92,17.25V10.75C11.92,10.62 11.97,10.5 12.08,10.4C12.19,10.29 12.31,10.24 12.45,10.24C12.59,10.24 12.72,10.29 12.83,10.4C12.94,10.5 13,10.62 13,10.75V17.25M10.05,16.13L8.55,14.63C8.45,14.5 8.42,14.36 8.46,14.22C8.5,14.07 8.59,13.96 8.74,13.89C8.88,13.82 9.03,13.81 9.18,13.86C9.32,13.91 9.44,14 9.54,14.13L12.45,17.04L15.36,14.13C15.4,14.09 15.45,14.06 15.5,14.04C15.55,14.02 15.6,14 15.65,14C15.7,14 15.75,14.02 15.8,14.04C15.85,14.06 15.9,14.09 15.94,14.13C16.04,14.23 16.08,14.36 16.08,14.5C16.08,14.64 16.04,14.77 15.94,14.87L14.44,16.37C14.32,16.5 14.25,16.67 14.25,16.88C14.25,17.09 14.32,17.27 14.46,17.42C14.59,17.56 14.76,17.64 14.96,17.64C15.16,17.64 15.33,17.56 15.46,17.42L16.96,15.92C17.35,15.54 17.54,15.07 17.54,14.5C17.54,13.93 17.35,13.46 16.96,13.08C16.58,12.69 16.11,12.5 15.54,12.5C14.96,12.5 14.5,12.69 14.13,13.08L12.45,14.78L10.77,13.1C10.39,12.71 9.93,12.51 9.35,12.51C8.77,12.51 8.31,12.7 7.92,13.08C7.54,13.47 7.35,13.93 7.35,14.5C7.35,15.07 7.54,15.54 7.92,15.92L9.43,17.43C9.57,17.57 9.74,17.64 9.94,17.64C10.14,17.64 10.31,17.56 10.44,17.42C10.59,17.27 10.66,17.09 10.66,16.88C10.66,16.67 10.59,16.5 10.46,16.36L10.05,16.13Z"
          />
        </svg>
      ),
      title: "AI Content Generation",
      description:
        "Create high-quality videos, images, and text with our cutting-edge AI tools."
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" className="text-dorfnew-primary">
          <path
            fill="currentColor"
            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"
          />
        </svg>
      ),
      title: "Creator Profiles",
      description:
        "Build your personal brand with customizable profiles and portfolios."
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" className="text-dorfnew-primary">
          <path
            fill="currentColor"
            d="M12,13A5,5 0 0,1 7,8H9A3,3 0 0,0 12,11A3,3 0 0,0 15,8H17A5,5 0 0,1 12,13M12,3A3,3 0 0,1 15,6H9A3,3 0 0,1 12,3M19,6H17A5,5 0 0,0 12,1A5,5 0 0,0 7,6H5C3.89,6 3,6.89 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8C21,6.89 20.1,6 19,6Z"
          />
        </svg>
      ),
      title: "Monetization Tools",
      description:
        "Turn your content into income with subscriptions, tips, and exclusive content."
    },
    {
      id: 4,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" className="text-dorfnew-primary">
          <path
            fill="currentColor"
            d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"
          />
        </svg>
      ),
      title: "Analytics Dashboard",
      description:
        "Track performance and growth with comprehensive analytics and insights."
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-dorfnew-primary/10 rounded-full blur-[150px] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for <span className="bg-gradient-primary bg-clip-text text-transparent">Modern Creators</span>
          </h2>
          <p className="text-lg text-dorfnew-muted max-w-2xl mx-auto">
            Everything you need to create, grow, and monetize your digital presence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feature) => (
            <div 
              key={feature.id} 
              className="glass-card p-6 hover:border-dorfnew-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-dorfnew-primary/10 flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-dorfnew-muted">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button className="gradient-button text-lg py-6 px-8">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
