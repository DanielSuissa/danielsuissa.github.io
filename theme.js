function createStars(count) {
    const sky = document.getElementById('sky');
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size between 2 and 6 pixels
        const size = Math.random() * 4 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation durations
        star.style.setProperty('--twinkle-duration', `${Math.random() * 3 + 2}s`);
        star.style.setProperty('--rotate-duration', `${Math.random() * 20 + 20}s`);
        star.style.setProperty('--orbit-radius', `${Math.random() * 30 + 10}px`);
        
        sky.appendChild(star);
    }
}

// Create 50 stars
createStars(50);
