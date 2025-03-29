/**
 * Parallax effect for UI elements
 * @module ParallaxEffect
 */
import { PARALLAX_ITEM_CLASS } from '../core/constants.js';

/**
 * ParallaxEffect class handles the parallax movement of UI elements
 */
export class ParallaxEffect {
    /**
     * Create a new ParallaxEffect instance
     */
    constructor() {
        /** @private {NodeListOf<Element>} */
        this.parallaxItems = document.querySelectorAll(`.${PARALLAX_ITEM_CLASS}`);
        /** @private {number} */
        this.width = window.innerWidth;
        /** @private {number} */
        this.height = window.innerHeight;
        
        // Initialize the effect
        this._init();
    }

    /**
     * Initialize parallax effect event listeners
     * @private
     */
    _init() {
        window.addEventListener('mousemove', this._handleMouseMove.bind(this));
        window.addEventListener('resize', this._handleResize.bind(this));
    }

    /**
     * Handle window resize event
     * @private
     */
    _handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    /**
     * Handle mouse movement for parallax effect
     * @param {MouseEvent} e - Mouse event
     * @private
     */
    _handleMouseMove(e) {
        const x = e.clientX / this.width;
        const y = e.clientY / this.height;
        
        this.parallaxItems.forEach(item => {
            const depth = item.getAttribute('data-depth');
            const moveX = x * depth * 50;
            const moveY = y * depth * 50;
            item.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
}
