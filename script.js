// EU Cross-Border Helper - Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and step content areas
    const navLinks = document.querySelectorAll('.nav-link');
    const stepContents = document.querySelectorAll('.step-content');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target step from data attribute
            const targetStep = this.getAttribute('data-step');
            
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all step contents
            stepContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the target step content
            const targetContent = document.getElementById(targetStep);
            if (targetContent) {
                targetContent.style.display = 'block';
                
                // Add a subtle animation effect
                targetContent.style.opacity = '0';
                targetContent.style.transform = 'translateY(10px)';
                
                // Trigger animation after a brief delay
                setTimeout(() => {
                    targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });
    
    // Add hover effects for better user experience
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Add a subtle scale effect on hover
            this.style.transform = 'translateX(2px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            // Reset transform
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const activeIndex = Array.from(navLinks).findIndex(link => 
                link.classList.contains('active')
            );
            
            let newIndex;
            if (e.key === 'ArrowDown') {
                newIndex = (activeIndex + 1) % navLinks.length;
            } else {
                newIndex = (activeIndex - 1 + navLinks.length) % navLinks.length;
            }
            
            navLinks[newIndex].click();
        }
    });
    
    // Initialize the first step as active
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link {
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);
