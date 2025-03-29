/**
 * Gallery-specific effects
 * @module GalleryEffects
 */

/**
 * GalleryEffects class handles gallery-specific animations and effects
 */
export class GalleryEffects {
    /**
     * Create a new GalleryEffects instance
     */
    constructor() {
        /** @private {NodeListOf<Element>} */
        this.galleryItems = document.querySelectorAll('.gallery-item');
        
        this._initEffects();
    }

    /**
     * Initialize gallery effects
     * @private
     */
    _initEffects() {
        // Add intersection observer for gallery items to create
        // animation effects when they come into view
        if ('IntersectionObserver' in window) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate__animated', 'animate__fadeIn');
                        observer.unobserve(entry.target);
                    }
                });
            }, options);
            
            this.galleryItems.forEach(item => {
                observer.observe(item);
            });
        }
        
        // Add hover effects for gallery items
        this.galleryItems.forEach(item => {
            item.addEventListener('mouseenter', this._handleItemHover.bind(this));
            item.addEventListener('mouseleave', this._handleItemLeave.bind(this));
        });
    }

    /**
     * Handle gallery item hover
     * @param {MouseEvent} e - Mouse event
     * @private
     */
    _handleItemHover(e) {
        const target = e.currentTarget;
        const caption = target.querySelector('.gallery-caption');
        
        if (caption) {
            caption.style.transform = 'translateY(0)';
        }
    }

    /**
     * Handle gallery item mouse leave
     * @param {MouseEvent} e - Mouse event
     * @private
     */
    _handleItemLeave(e) {
        const target = e.currentTarget;
        const caption = target.querySelector('.gallery-caption');
        
        if (caption) {
            caption.style.transform = 'translateY(100%)';
        }
    }
}
