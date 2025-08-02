import { useEffect, useRef } from 'react';
import VideoBackground from './VideoBackground';

const ThreeDBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles dynamically
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      
      const particlesContainer = container.querySelector('.particles');
      if (particlesContainer) {
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (particlesContainer.contains(particle)) {
            particlesContainer.removeChild(particle);
          }
        }, 8000);
      }
    };

    // Create particles continuously
    const particleInterval = setInterval(createParticle, 300);

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-3d-background">
      {/* AI Generated Video Background */}
      <VideoBackground />
      
      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
      
      {/* Particle System */}
      <div className="particles"></div>
      
      {/* Additional Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-cyan/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ThreeDBackground;