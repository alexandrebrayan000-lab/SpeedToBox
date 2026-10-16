'use client';

import React from 'react';
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

interface BarChartProps {
  data: any;
  options?: any;
}

export function CyberBarChart({ data, options }: BarChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#A3B2D1', font: { family: 'Inter', size: 11 } }
      },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
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
        ticks: { color: '#64748B', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 11 } }
      }
    },
    ...options
  };

  return <Bar data={data} options={defaultOptions} />;
}

interface LineChartProps {
  data: any;
  options?: any;
}

export function CyberLineChart({ data, options }: LineChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#A3B2D1', font: { family: 'Inter', size: 11 } }
      },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
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
        ticks: { color: '#64748B', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 11 } }
      }
    },
    ...options
  };

  return <Line data={data} options={defaultOptions} />;
}

interface DoughnutChartProps {
  data: any;
  options?: any;
}

export function CyberDoughnutChart({ data, options }: DoughnutChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#A3B2D1', boxWidth: 12, padding: 12, font: { family: 'Inter', size: 11 } }
      },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
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
