import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollOffsetRef = useRef(0);

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

    // Parallax scroll effect
    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY * 0.3;
    };
    window.addEventListener('scroll', handleScroll);

    // Create particles
    // Detect mobile to reduce particle count
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 2,
        opacity: Math.random() * 0.4 + 0.6,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop
    const animate = () => {
      // Redraw the gradient to maintain original colors
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0f1e');
      gradient.addColorStop(1, '#1a2744');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update pulse phase
        particle.pulsePhase += particle.pulseSpeed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with parallax offset and pulsation
        let drawY = (particle.y - scrollOffsetRef.current) % canvas.height;
        if (drawY < 0) drawY += canvas.height;

        // Calculate pulsating size
        const pulseFactor = Math.sin(particle.pulsePhase) * 0.3 + 1;
        const currentSize = particle.size * pulseFactor;

        ctx.beginPath();
        ctx.arc(particle.x, drawY, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 200, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw lines to nearby particles with parallax
        particles.slice(i + 1).forEach((otherParticle) => {
          let otherDrawY = (otherParticle.y - scrollOffsetRef.current) % canvas.height;
          if (otherDrawY < 0) otherDrawY += canvas.height;

          const dx = particle.x - otherParticle.x;
          const dy = drawY - otherDrawY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, drawY);
            ctx.lineTo(otherParticle.x, otherDrawY);
            const opacity = (1 - distance / 150) * 0.3;
            ctx.strokeStyle = `rgba(60, 120, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw random crossing lines
      if (Math.random() < 0.02) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(100, 180, 255, 0.2)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default AnimatedBackground;
