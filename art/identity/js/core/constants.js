/**
 * Application constants and configuration
 * Centralized location for all magic strings and configuration values
 * @module constants
 */

/**
 * DOM element IDs used throughout the application
 * @constant
 */
export const CANVAS_ID = 'background-canvas';
export const CURSOR_CLASS = 'cursor-custom';
export const PARALLAX_ITEM_CLASS = 'parallax-item';
export const INTERACT_BUTTON_ID = 'interact-btn';
export const INFO_TEXT_ID = "info-text";

/**
 * Animation and visual constants
 * @constant
 */
export const PARTICLE_CONFIG = {
    MIN_SIZE: 1,
    MAX_SIZE: 5,
    CONNECTION_DISTANCE: 60,
    MOUSE_REPEL_DISTANCE: 150,
    REPEL_FORCE_DIVISOR: 15,
    FLOW_SPEED_MIN: 0.2,
    FLOW_SPEED_MAX: 0.5,
    FLOW_ANGLE_INCREMENT: 0.01,
    IMAGE_LIST: 5,  // The number of "abstract art works"
    CLUMP_SPEED: 0.05,   // Higher - faster
    CLUMP_PERCENT: 1, // The percentage of particles used for clumping
    PARTICLE_DENSITY_DIVISOR: 5000 // Higher = fewer particles
};

/**
 * Color palette used throughout the application
 * @constant
 */
export const COLOR_PALETTE = [
    'rgb(255, 94, 91)',  // Coral
    'rgb(215, 137, 215)', // Lavender
    'rgb(157, 101, 201)', // Purple
    'rgb(93, 84, 164)'   // Deep Purple
];
