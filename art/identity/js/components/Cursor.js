/**
 * Custom cursor component
 * @module Cursor
 */
import { CURSOR_CLASS } from '../core/constants.js';

/**
 * Cursor class manages the custom cursor display and behavior
 */
export class Cursor {
    /**
     * Create a new Cursor instance
     */
    constructor() {
        /** @private {HTMLElement} */
        this.cursorElement = document.querySelector(`.${CURSOR_CLASS}`);
        
        // Initialize the cursor events
        this._init();
    }

    /**
     * Initialize the cursor events
     * @private
     */
    _init() {
        // Track mouse position for cursor
        window.addEventListener('mousemove', (e) => {
            this.cursorElement.style.left = e.clientX + 'px';
            this.cursorElement.style.top = e.clientY + 'px';
        });
        
        // Mouse down effect
        document.addEventListener('mousedown', () => {
            this._expand();
        });
        
        // Mouse up effect
        document.addEventListener('mouseup', () => {
            this._reset();
        });
        
        // Handle cursor leaving window
        document.addEventListener('mouseleave', () => {
            this.cursorElement.style.opacity = '0';
        });
        
        // Handle cursor entering window
        document.addEventListener('mouseenter', () => {
            this.cursorElement.style.opacity = '1';
        });
    }

    /**
     * Expands the cursor (for mouse down effect)
     * @private
     */
    _expand() {
        this.cursorElement.style.width = '30px';
        this.cursorElement.style.height = '30px';
        this.cursorElement.style.backgroundColor = 'rgba(215, 137, 215, 0.5)';
    }

    /**
     * Resets the cursor to default state
     * @private
     */
    _reset() {
        this.cursorElement.style.width = '20px';
        this.cursorElement.style.height = '20px';
        this.cursorElement.style.backgroundColor = 'rgba(255, 94, 91, 0.5)';
    }
}
