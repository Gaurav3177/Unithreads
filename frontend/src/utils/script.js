// utils/script.js

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('postContent');
    const placeholderText = "What's on your mind?";
    let index = 0;
    let isDeleting = false;
    let interval = 100;
    let delay = 2000; // Delay before starting the animation
    let typingInterval;

    function type() {
        if (index <= placeholderText.length && !isDeleting) {
            textarea.setAttribute('placeholder', placeholderText.substring(0, index));
            index++;
        } else if (index > 0 && isDeleting) {
            textarea.setAttribute('placeholder', placeholderText.substring(0, index));
            index--;
        }

        if (index === placeholderText.length) {
            isDeleting = true;
        } else if (index === 0 && isDeleting) {
            isDeleting = false;
        }
    }

    function startTypingEffect() {
        typingInterval = setInterval(type, interval);
        setTimeout(() => {
            clearInterval(typingInterval);
            setTimeout(startTypingEffect, delay); // Delay before repeating the effect
        }, delay);
    }

    // Start typing effect
    startTypingEffect();
});
