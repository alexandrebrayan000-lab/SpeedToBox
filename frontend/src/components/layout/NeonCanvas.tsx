'use client';

import React, { useEffect, useRef } from 'react';

export function NeonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Circuits
    const circuits: Array<{
      points: Array<{ x: number; y: number }>;
      color: string;
      glowColor: string;
    }> = [];

    const circuitCount = 8;
    const step = height / (circuitCount + 1);

    for (let i = 0; i < circuitCount; i++) {
      const y = (i + 1) * step + (Math.random() * 40 - 20);
      const points = [];
      let currentX = 0;
      let currentY = y;
      points.push({ x: currentX, y: currentY });

      while (currentX < width) {
        currentX += 80 + Math.random() * 140;
        if (Math.random() > 0.4) {
          const dy = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40);
          currentY = Math.max(20, Math.min(height - 20, currentY + dy));
        }
        points.push({ x: currentX, y: currentY });
      }

      circuits.push({
        points,
        color: i % 2 === 0 ? 'rgba(22, 139, 255, 0.08)' : 'rgba(139, 53, 255, 0.07)',
        glowColor: i % 2 === 0 ? '#00D9FF' : '#8B35FF'
      });
    }

    // Pulses
    const pulses = [
      { circuit: 0, progress: 0.1, speed: 0.002, color: '#00D9FF' },
      { circuit: 2, progress: 0.4, speed: 0.0025, color: '#8B35FF' },
      { circuit: 4, progress: 0.7, speed: 0.002, color: '#00D9FF' },
      { circuit: 6, progress: 0.2, speed: 0.003, color: '#00E6A0' },
    ];

    // Particles
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.15 - Math.random() * 0.3,
      alpha: 0.15 + Math.random() * 0.35,
      color: Math.random() > 0.5 ? '#00D9FF' : '#8B35FF'
    }));

    let animId: number;
    let ambientTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ambientTime += 0.003;

      // Ambient radial orbs
      const orb1X = width * 0.2 + Math.sin(ambientTime * 0.7) * (width * 0.08);
      const orb1Y = height * 0.25 + Math.cos(ambientTime * 0.5) * (height * 0.1);
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.4);
      grad1.addColorStop(0, 'rgba(0, 217, 255, 0.06)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.8 + Math.cos(ambientTime * 0.6) * (width * 0.08);
      const orb2Y = height * 0.7 + Math.sin(ambientTime * 0.4) * (height * 0.1);
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.4);
      grad2.addColorStop(0, 'rgba(139, 53, 255, 0.05)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw circuit lines
      for (const c of circuits) {
        if (c.points.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(c.points[0].x, c.points[0].y);
        for (let i = 1; i < c.points.length; i++) {
          ctx.lineTo(c.points[i].x, c.points[i].y);
        }
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw pulses
      for (const p of pulses) {
        const c = circuits[p.circuit % circuits.length];
        if (!c || c.points.length < 2) continue;

        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const totalSegments = c.points.length - 1;
        const targetSeg = Math.min(Math.floor(p.progress * totalSegments), totalSegments - 1);
        const segProgress = (p.progress * totalSegments) - targetSeg;

        const p1 = c.points[targetSeg];
        const p2 = c.points[targetSeg + 1];
        if (p1 && p2) {
          const curX = p1.x + (p2.x - p1.x) * segProgress;
          const curY = p1.y + (p2.y - p1.y) * segProgress;

          ctx.beginPath();
          ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw floating particles
      for (const pt of particles) {
        pt.y += pt.vy;
        pt.x += pt.vx;
        if (pt.y < 0) pt.y = height;
        if (pt.x < 0) pt.x = width;
        if (pt.x > width) pt.x = 0;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}
