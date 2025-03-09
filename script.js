// Add scroll animation for services
const services = document.querySelectorAll('.service');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateX(0)';
    }
  });
}, { threshold: 0.5 });

services.forEach((service) => {
  observer.observe(service);
});