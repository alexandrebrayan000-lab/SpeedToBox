'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: any;
  options?: any;
}

export function CyberBarChart({ data, options }: ChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full animate-pulse bg-slate-900/40 rounded-xl" />;
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#A3B2D1',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0B1228',
        titleColor: '#00D9FF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(0, 217, 255, 0.4)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 10 } }
      }
    },
    ...options
  };

  return <Bar data={data} options={defaultOptions} />;
}

export function CyberLineChart({ data, options }: ChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full animate-pulse bg-slate-900/40 rounded-xl" />;
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#A3B2D1',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0B1228',
        titleColor: '#8B35FF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(139, 53, 255, 0.4)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 10 } }
      }
    },
    ...options
  };

  return <Line data={data} options={defaultOptions} />;
}

export function CyberDoughnutChart({ data, options }: ChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full animate-pulse bg-slate-900/40 rounded-xl" />;
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0B1228',
        titleColor: '#00D9FF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(0, 217, 255, 0.4)',
        borderWidth: 1,
        padding: 10
      }
    },
    ...options
  };

  return <Doughnut data={data} options={defaultOptions} />;
}
