// Animation utilities using Intersection Observer API

// Initialize scroll animations
export const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll(
    '.slide-in-left, .slide-in-right, .slide-in-bottom'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once the animation has played, we can unobserve the element
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }); // Trigger when 20% of the element is visible
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
};

// Initialize chart animations
export const initChartAnimations = () => {
  const chartElements = document.querySelectorAll('.chart-bar, .radar-chart path');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class when element is visible
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  chartElements.forEach(element => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
};

// Animate radar chart when data changes
export const animateRadarChart = (chartRef, newData) => {
  if (!chartRef.current) return;
  
  const chart = chartRef.current;
  
  // Animate the transition to new data
  chart.data.datasets[0].data = newData;
  chart.update({
    duration: 800,
    easing: 'easeOutQuart'
  });
};