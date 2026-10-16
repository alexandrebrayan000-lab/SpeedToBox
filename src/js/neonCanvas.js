/**
 * StockPro Cyberpunk Neon Ambient Canvas Engine
 * High-performance 2D Canvas rendering flowing circuit tracks,
 * pulsating cyber-nodes, soft radial gradients, floating digital particles,
 * and ambient luminescence across all views.
 */

class NeonCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = 0;
    this.height = 0;
    this.particles = [];
    this.circuits = [];
    this.pulses = [];
    this.ambientTime = 0;
    this.intensity = 'alta'; // 'alta' | 'media' | 'sutil' | 'desativada'
    this.isRunning = false;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Listen for intensity changes from settings
    window.addEventListener('stockpro:setting-changed', (e) => {
      if (e.detail && e.detail.key === 'visualEffects') {
        this.setIntensity(e.detail.value);
      }
    });

    this.createCircuits();
    this.createParticles();
    this.start();
  }

  setIntensity(level) {
    this.intensity = level;
    if (level === 'desativada') {
      this.stop();
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      this.createCircuits();
      this.createParticles();
      if (!this.isRunning) this.start();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createCircuits() {
    this.circuits = [];
    if (this.intensity === 'desativada') return;

    const count = this.intensity === 'alta' ? 14 : this.intensity === 'media' ? 8 : 4;
    const step = this.height / (count + 1);

    for (let i = 0; i < count; i++) {
      const y = (i + 1) * step + (Math.random() * 40 - 20);
      const points = [];
      let currentX = 0;
      let currentY = y;
      points.push({ x: currentX, y: currentY });

      while (currentX < this.width) {
        currentX += 80 + Math.random() * 140;
        // Turn 45 or 90 degrees
        if (Math.random() > 0.4) {
          const dy = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40);
          currentY = Math.max(20, Math.min(this.height - 20, currentY + dy));
        }
        points.push({ x: currentX, y: currentY });
      }

      this.circuits.push({
        points: points,
        color: i % 2 === 0 ? 'rgba(22, 139, 255, 0.08)' : 'rgba(139, 53, 255, 0.07)',
        glowColor: i % 2 === 0 ? '#00D9FF' : '#8B35FF',
        alpha: 0.15 + Math.random() * 0.15
      });
    }

    // Initialize light pulses along circuits
    this.pulses = [];
    const pulseCount = this.intensity === 'alta' ? 8 : 4;
    for (let i = 0; i < pulseCount; i++) {
      const circuitIndex = Math.floor(Math.random() * this.circuits.length);
      this.pulses.push({
        circuitIndex: circuitIndex,
        segmentIndex: 0,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        size: 2 + Math.random() * 2.5,
        color: Math.random() > 0.5 ? '#00D9FF' : '#8B35FF'
      });
    }
  }

  createParticles() {
    this.particles = [];
    if (this.intensity === 'desativada') return;

    const count = this.intensity === 'alta' ? 55 : this.intensity === 'media' ? 30 : 15;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.35,
        alpha: 0.1 + Math.random() * 0.45,
        baseAlpha: 0.2 + Math.random() * 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseAngle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.6 ? '#00D9FF' : (Math.random() > 0.5 ? '#8B35FF' : '#168BFF')
      });
    }
  }

  drawAmbientGradients() {
    this.ambientTime += 0.004;
    const ctx = this.ctx;

    // Moving radial glowing orbs (deep in background)
    const orb1X = this.width * 0.25 + Math.sin(this.ambientTime * 0.7) * (this.width * 0.12);
    const orb1Y = this.height * 0.3 + Math.cos(this.ambientTime * 0.5) * (this.height * 0.15);
    const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, this.width * 0.45);
    grad1.addColorStop(0, 'rgba(22, 139, 255, 0.08)');
    grad1.addColorStop(0.5, 'rgba(139, 53, 255, 0.03)');
    grad1.addColorStop(1, 'rgba(5, 8, 22, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, this.width, this.height);

    const orb2X = this.width * 0.75 + Math.cos(this.ambientTime * 0.6) * (this.width * 0.15);
    const orb2Y = this.height * 0.7 + Math.sin(this.ambientTime * 0.8) * (this.height * 0.15);
    const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, this.width * 0.4);
    grad2.addColorStop(0, 'rgba(139, 53, 255, 0.07)');
    grad2.addColorStop(0.6, 'rgba(243, 43, 255, 0.02)');
    grad2.addColorStop(1, 'rgba(5, 8, 22, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawCircuits() {
    const ctx = this.ctx;
    ctx.lineWidth = 1;

    for (const circuit of this.circuits) {
      if (circuit.points.length < 2) continue;

      ctx.beginPath();
      ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
      for (let i = 1; i < circuit.points.length; i++) {
        ctx.lineTo(circuit.points[i].x, circuit.points[i].y);
      }
      ctx.strokeStyle = circuit.color;
      ctx.stroke();

      // Draw small junction nodes on some vertices
      for (let i = 0; i < circuit.points.length; i += 2) {
        const pt = circuit.points[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = circuit.color;
        ctx.fill();
      }
    }
  }

  drawPulses() {
    const ctx = this.ctx;

    for (const pulse of this.pulses) {
      const circuit = this.circuits[pulse.circuitIndex];
      if (!circuit || circuit.points.length < 2) continue;

      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.segmentIndex++;
        if (pulse.segmentIndex >= circuit.points.length - 1) {
          pulse.segmentIndex = 0;
          pulse.circuitIndex = Math.floor(Math.random() * this.circuits.length);
        }
      }

      const p1 = circuit.points[pulse.segmentIndex];
      const p2 = circuit.points[pulse.segmentIndex + 1];
      if (!p1 || !p2) continue;

      const currentX = p1.x + (p2.x - p1.x) * pulse.progress;
      const currentY = p1.y + (p2.y - p1.y) * pulse.progress;

      // Draw glowing light packet
      ctx.save();
      ctx.shadowColor = pulse.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(currentX, currentY, pulse.size, 0, Math.PI * 2);
      ctx.fill();

      // Outer aura
      ctx.beginPath();
      ctx.arc(currentX, currentY, pulse.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = pulse.color;
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.restore();
    }
  }

  drawParticles() {
    const ctx = this.ctx;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulseAngle += p.pulseSpeed;
      const currentAlpha = Math.max(0.05, p.baseAlpha + Math.sin(p.pulseAngle) * 0.15);

      // Wrap around smoothly
      if (p.y < 0) {
        p.y = this.height + 5;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

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
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const animate = () => {
      if (!this.isRunning) return;

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawAmbientGradients();
      this.drawCircuits();
      this.drawPulses();
      this.drawParticles();

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.neonCanvasInstance = new NeonCanvasEngine('neon-canvas-bg');
});
