export const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll(
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

export const initChartAnimations = () => {
  const chartElements = document.querySelectorAll('.chart-bar, .radar-chart path');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
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

export const animateRadarChart = (chartRef, newData) => {
  if (!chartRef.current) return;
  
  const chart = chartRef.current;
  
  chart.data.datasets[0].data = newData;
  chart.update({
    duration: 800,
    easing: 'easeOutQuart'
  });
};

export const drawRadarChartAnimation = (chartRef) => {
  if (!chartRef.current) return;

  const chart = chartRef.current;
  const paths = chart.canvas.querySelectorAll('.radar-chart path');

  paths.forEach((path) => {
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    path.style.animation = 'drawCircle 1.5s ease-out forwards';
  });
};

export const updateRadarChartDataAnimation = (chartRef, newData) => {
  if (!chartRef.current) return;

  const chart = chartRef.current;

  chart.data.datasets[0].data = newData;
  chart.update({
    duration: 800,
    easing: 'easeOutQuart'
  });
};

export const pointHoverAnimation = (chartRef) => {
  if (!chartRef.current) return;

  const chart = chartRef.current;
  const points = chart.canvas.querySelectorAll('.radar-chart .point');

  points.forEach((point) => {
    point.addEventListener('mouseenter', () => {
      point.style.transform = 'scale(1.2)';
    });

    point.addEventListener('mouseleave', () => {
      point.style.transform = 'scale(1)';
    });
  });
};
