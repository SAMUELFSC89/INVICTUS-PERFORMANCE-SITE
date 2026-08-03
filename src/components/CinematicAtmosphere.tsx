/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export default function CinematicAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system definition
    const PARTICLE_COUNT = Math.min(65, Math.floor(window.innerWidth / 20));
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vy: number;
      vx: number;
      alpha: number;
      maxAlpha: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(6, 182, 212, ',   // Cyan
      'rgba(16, 185, 129, ',  // Emerald
      'rgba(236, 72, 153, ',  // Subtle Pink accent
      'rgba(245, 158, 11, '   // Invictus Amber
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        vy: -(Math.random() * 0.4 + 0.1),
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        maxAlpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Energy Ring Waves
    const rings: Array<{ radius: number; maxRadius: number; alpha: number; speed: number }> = [
      { radius: 100, maxRadius: 600, alpha: 0.4, speed: 0.8 },
      { radius: 250, maxRadius: 750, alpha: 0.25, speed: 0.6 },
      { radius: 400, maxRadius: 900, alpha: 0.15, speed: 0.5 }
    ];

    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Ambient Volumetric Gradients based on scroll position
      const scrollFactor = (scrollY / (document.documentElement.scrollHeight - height || 1));
      
      // Top AI Orb Glow Anchor (moves subtly with scroll)
      const orbX = width * 0.5 + Math.sin(time * 0.5) * 30;
      const orbY = Math.max(250, 400 - scrollY * 0.15);

      const radGrad = ctx.createRadialGradient(
        orbX, orbY, 10,
        orbX, orbY, Math.max(width * 0.7, 700)
      );

      // Blend AI Emerald/Cyan core with Invictus Amber
      radGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      radGrad.addColorStop(0.3, 'rgba(16, 185, 129, 0.04)');
      radGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.02)');
      radGrad.addColorStop(1, 'rgba(4, 4, 6, 0)');

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Continuous Expanding AI Energy Waves
      rings.forEach(ring => {
        ring.radius += ring.speed;
        if (ring.radius > ring.maxRadius) {
          ring.radius = 80;
        }
        const currentAlpha = Math.max(0, (1 - ring.radius / ring.maxRadius) * ring.alpha);
        
        ctx.beginPath();
        ctx.arc(orbX, orbY, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${currentAlpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Render Gym Silhouette & Metallic Bokeh Accents
      ctx.fillStyle = 'rgba(255, 255, 255, 0.012)';
      // Abstract Rack Vertical Beams in Soft Bokeh
      ctx.fillRect(width * 0.08, 0, 4, height);
      ctx.fillRect(width * 0.92, 0, 4, height);

      // Horizontal Bar Crossbeam
      ctx.fillRect(0, height * 0.35, width, 2);

      // 4. Render Floating Particles
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.15;
        p.alpha += Math.sin(time * p.pulseSpeed) * 0.008;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        const clampedAlpha = Math.max(0.05, Math.min(p.maxAlpha, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${clampedAlpha})`;
        ctx.shadowBlur = p.radius > 1.8 ? 8 : 0;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
