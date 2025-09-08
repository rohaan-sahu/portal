// Main application logic for Playrush Portal

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Playrush Portal initialized');

  // Add any global event listeners or initialization code here
  // For example, handling navigation, modals, etc.

  // Example: Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Example: Handle mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('nav-open');
    });
  }

  // Add loading states for async operations
  window.addEventListener('load', function() {
    // Remove loading spinner if present
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = 'none';
    }
  });
});

// Export any utility functions if needed
export const utils = {
  // Add utility functions here
  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};
