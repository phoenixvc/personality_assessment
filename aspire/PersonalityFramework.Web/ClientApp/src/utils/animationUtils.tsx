import { Chart } from 'chart.js';
import { RefObject } from 'react';

/**
 * Initializes scroll animations for elements with specific classes
 */
export const initScrollAnimations = (): void => {
  const animatedElements = document.querySelectorAll<HTMLElement>(
    '.slide-in-left, .slide-in-right, .slide-in-bottom'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
};

/**
 * Initializes animations for chart elements
 */
export const initChartAnimations = (): void => {
  const chartElements = document.querySelectorAll<HTMLElement>('.chart-bar, .radar-chart path');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  chartElements.forEach(element => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
};

/**
 * Animates a radar chart with new data
 * @param chartRef - Reference to the chart component
 * @param newData - New data points for the chart
 */
export const animateRadarChart = (chartRef: RefObject<Chart>, newData: number[]): void => {
  if (!chartRef.current) return;
  
  const chart = chartRef.current;
  
  chart.data.datasets[0].data = newData;
  
  // Use type assertion to allow animation configuration
  chart.update({
    duration: 800,
    easing: 'easeOutQuart'
  } as any);
};

/**
 * Creates a drawing animation for radar chart paths
 * @param chartRef - Reference to the chart component
 */
export const drawRadarChartAnimation = (chartRef: RefObject<Chart>): void => {
  if (!chartRef.current) return;

  const chart = chartRef.current;
  const paths = chart.canvas.querySelectorAll<SVGPathElement>('.radar-chart path');

  paths.forEach((path) => {
    path.style.strokeDasharray = path.getTotalLength().toString();
    path.style.strokeDashoffset = path.getTotalLength().toString();
    path.style.animation = 'drawCircle 1.5s ease-out forwards';
    });
};

/**
 * Updates radar chart data with animation
 * @param chartRef - Reference to the chart component
 * @param newData - New data points for the chart
 */
export const updateRadarChartDataAnimation = (chartRef: RefObject<Chart>, newData: number[]): void => {
  if (!chartRef.current) return;

  const chart = chartRef.current;

  chart.data.datasets[0].data = newData;
  
  // Use type assertion to allow animation configuration
  chart.update({
    duration: 800,
    easing: 'easeOutQuart'
  } as any);
};

/**
 * Adds hover animation to chart points
 * @param chartRef - Reference to the chart component
 */
export const pointHoverAnimation = (chartRef: RefObject<Chart>): void => {
  if (!chartRef.current) return;

  const chart = chartRef.current;
  const points = chart.canvas.querySelectorAll<HTMLElement>('.radar-chart .point');

  points.forEach((point) => {
    point.addEventListener('mouseenter', () => {
      point.style.transform = 'scale(1.2)';
    });

    point.addEventListener('mouseleave', () => {
      point.style.transform = 'scale(1)';
    });
  });
};