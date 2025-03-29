/**
 * Main application entry point
 * Initializes all components and sets up event listeners
 * @module main
 */
import { Canvas } from './components/Canvas.js';
import { Cursor } from './components/Cursor.js';
import { ParallaxEffect } from './components/ParallaxEffect.js';
import { Navigation } from './ui/Navigation.js';
import { InteractiveElements } from './ui/InteractiveElements.js';
import { GalleryEffects } from './ui/GalleryEffects.js';
import { CANVAS_ID } from './core/constants.js';
import { calculateColorRGB, colorToString } from './core/utils.js';

/**
 * Initializes the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    const canvas = new Canvas(CANVAS_ID);
    const cursor = new Cursor();
    const parallax = new ParallaxEffect();
    const navigation = new Navigation();
    const interactiveElements = new InteractiveElements(canvas);
    const galleryEffects = new GalleryEffects();
    
    // Setup window resize handler
    window.addEventListener('resize', () => {
        canvas.resize();
    });
    
    // Start animation loop
    canvas.startAnimation();
});
