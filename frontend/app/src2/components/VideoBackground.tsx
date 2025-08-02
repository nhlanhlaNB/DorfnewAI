import { useEffect, useRef } from 'react';
import spaceshipFrame from '@/src2/assets/spaceship-video-frame.jpg';

const VideoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create animated spaceship scene
    const img = new Image();
    img.src = spaceshipFrame;
    
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create parallax effect with multiple layers
      const layers = [
        { scale: 1.2, speed: 0.3, opacity: 0.4 },
        { scale: 1.1, speed: 0.5, opacity: 0.6 },
        { scale: 1.0, speed: 0.8, opacity: 0.8 }
      ];

      layers.forEach((layer, index) => {
        ctx.save();
        ctx.globalAlpha = layer.opacity;
        
        // Calculate movement
        const offsetX = Math.sin(time * layer.speed) * 50;
        const offsetY = Math.cos(time * layer.speed * 0.7) * 30;
        
        // Scale and position
        const scaledWidth = canvas.width * layer.scale;
        const scaledHeight = canvas.height * layer.scale;
        const x = (canvas.width - scaledWidth) / 2 + offsetX;
        const y = (canvas.height - scaledHeight) / 2 + offsetY;
        
        if (img.complete) {
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        }
        
        ctx.restore();
      });

      // Add floating particles
      for (let i = 0; i < 50; i++) {
        const particleTime = time + i * 0.1;
        const x = (Math.sin(particleTime * 0.5) * canvas.width * 0.4) + canvas.width * 0.5;
        const y = (Math.cos(particleTime * 0.3) * canvas.height * 0.4) + canvas.height * 0.5;
        const size = Math.sin(particleTime * 2) * 2 + 3;
        const opacity = Math.sin(particleTime * 1.5) * 0.5 + 0.5;
        
        ctx.save();
        ctx.globalAlpha = opacity * 0.6;
        ctx.fillStyle = i % 3 === 0 ? '#9b87f5' : i % 3 === 1 ? '#c084fc' : '#22d3ee';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Add energy waves
      for (let i = 0; i < 3; i++) {
        const waveTime = time + i * 2;
        const radius = (Math.sin(waveTime) * 0.5 + 0.5) * Math.min(canvas.width, canvas.height) * 0.3;
        const opacity = Math.sin(waveTime * 2) * 0.3 + 0.3;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = i % 2 === 0 ? '#9b87f5' : '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas.width * 0.5, canvas.height * 0.5, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    img.onload = () => {
      animate();
    };

    // Start animation even if image hasn't loaded
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.7) contrast(1.1)' }}
      />
      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
    </div>
  );
};

export default VideoBackground;