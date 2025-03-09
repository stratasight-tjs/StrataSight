document.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const blurValue = Math.min(scrollPosition / 40, 5); // Adjust blur based on scroll position, max 5px
    const background = document.querySelector('.background');
    
    // Define the point where the blur effect should start (halfway down the screen)
    const blurStart = window.innerHeight / 2;

    if (scrollPosition >= blurStart) {
        background.style.filter = `blur(${blurValue}px)`;
    } else {
        background.style.filter = 'none'; // Remove the blur if the scroll position is before the halfway point
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const navigation = document.querySelector('.navigation');

    menuIcon.addEventListener('click', () => {
        navigation.classList.toggle('active'); // Toggle the 'active' class to show/hide the navigation
    });
});
