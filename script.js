// script.js
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavButtons = document.querySelector('.nav-buttons-mobile');
  
    hamburgerMenu.addEventListener('click', function () {
      mobileNavButtons.classList.toggle('active');
    });
  });