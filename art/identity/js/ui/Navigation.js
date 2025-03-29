/**
 * Navigation component for smooth scrolling
 * @module Navigation
 */

/**
 * Navigation class handles smooth scrolling for anchor links
 */
export class Navigation {
    /**
     * Create a new Navigation instance
     */
    constructor() {
        this._initSmoothScrolling();
    }

    /**
     * Initialize smooth scrolling for navigation links
     * @private
     */
    _initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the target element
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}
