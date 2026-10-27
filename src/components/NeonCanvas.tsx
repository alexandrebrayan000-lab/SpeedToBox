'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseAngle: number;
  color: string;
}

interface Circuit {
  points: Array<{ x: number; y: number }>;
  color: string;
  glowColor: string;
  alpha: number;
}

interface Pulse {
  circuitIndex: number;
  segmentIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

export function NeonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useStore();
  const intensity = settings.preferencias.visualEffects;

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
      createCircuits();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    let circuits: Circuit[] = [];
    let pulses: Pulse[] = [];
    let particles: Particle[] = [];
    let ambientTime = 0;

    const createCircuits = () => {
      circuits = [];
      pulses = [];
      if (intensity === 'desativada') return;

      const count = intensity === 'alta' ? 14 : intensity === 'media' ? 8 : 4;
      const step = height / (count + 1);

      for (let i = 0; i < count; i++) {
        const y = (i + 1) * step + (Math.random() * 40 - 20);
        const points: Array<{ x: number; y: number }> = [];
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
          glowColor: i % 2 === 0 ? '#00D9FF' : '#8B35FF',
          alpha: 0.15 + Math.random() * 0.15
        });
      }

      const pulseCount = intensity === 'alta' ? 8 : 4;
      for (let i = 0; i < pulseCount; i++) {
        const circuitIndex = Math.floor(Math.random() * circuits.length);
        pulses.push({
          circuitIndex,
          segmentIndex: 0,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          size: 2 + Math.random() * 2.5,
          color: Math.random() > 0.5 ? '#00D9FF' : '#8B35FF'
        });
      }
    };

    const createParticles = () => {
      particles = [];
      if (intensity === 'desativada') return;

      const count = intensity === 'alta' ? 55 : intensity === 'media' ? 30 : 15;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.8 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.15 - Math.random() * 0.35,
          alpha: 0.1 + Math.random() * 0.45,
          baseAlpha: 0.2 + Math.random() * 0.3,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulseAngle: Math.random() * Math.PI * 2,
          color: Math.random() > 0.6 ? '#00D9FF' : Math.random() > 0.5 ? '#8B35FF' : '#168BFF'
        });
      }
    };

    createCircuits();
    createParticles();

    const render = () => {
      if (intensity === 'desativada') {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Ambient Radial Gradients
      ambientTime += 0.004;
      const orb1X = width * 0.25 + Math.sin(ambientTime * 0.7) * (width * 0.12);
      const orb1Y = height * 0.3 + Math.cos(ambientTime * 0.5) * (height * 0.15);
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(22, 139, 255, 0.08)');
      grad1.addColorStop(0.5, 'rgba(139, 53, 255, 0.03)');
      grad1.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.75 + Math.cos(ambientTime * 0.6) * (width * 0.15);
      const orb2Y = height * 0.7 + Math.sin(ambientTime * 0.8) * (height * 0.15);
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.4);
      grad2.addColorStop(0, 'rgba(139, 53, 255, 0.07)');
      grad2.addColorStop(0.6, 'rgba(243, 43, 255, 0.02)');
      grad2.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Circuits
      ctx.lineWidth = 1;
      for (const circuit of circuits) {
        if (circuit.points.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
        for (let i = 1; i < circuit.points.length; i++) {
          ctx.lineTo(circuit.points[i].x, circuit.points[i].y);
        }
        ctx.strokeStyle = circuit.color;
        ctx.stroke();

        for (let i = 0; i < circuit.points.length; i += 2) {
          const pt = circuit.points[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = circuit.color;
          ctx.fill();
        }
      }

      // 3. Draw Light Pulses
      for (const pulse of pulses) {
        const circuit = circuits[pulse.circuitIndex];
        if (!circuit || circuit.points.length < 2) continue;

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.segmentIndex++;
          if (pulse.segmentIndex >= circuit.points.length - 1) {
            pulse.segmentIndex = 0;
            pulse.circuitIndex = Math.floor(Math.random() * circuits.length);
          }
        }

        const p1 = circuit.points[pulse.segmentIndex];
        const p2 = circuit.points[pulse.segmentIndex + 1];
        if (!p1 || !p2) continue;

        const currentX = p1.x + (p2.x - p1.x) * pulse.progress;
        const currentY = p1.y + (p2.y - p1.y) * pulse.progress;

        ctx.save();
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(currentX, currentY, pulse.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(currentX, currentY, pulse.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulseAngle += p.pulseSpeed;
        const currentAlpha = Math.max(0.05, p.baseAlpha + Math.sin(p.pulseAngle) * 0.15);

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return <canvas id="neon-canvas-bg" ref={canvasRef} />;
}
