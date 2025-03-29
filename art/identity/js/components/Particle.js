/**
 * Particle component for canvas animations
 * @module Particle
 */
import { PARTICLE_CONFIG } from '../core/constants.js';
import { calculateDistance, createGradient, lerpPoints, lerpColors, calculateColorValues } from '../core/utils.js';

/**
 * Particle class represents a single particle in the animation system
 */
export class Particle {
    /**
     * Create a new Particle
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} size - Particle size
     * @param {string} color - Particle color in RGB format
     * @param {number} weight - Particle weight (affects movement)
     * @param {number} canvasWidth - Width of the canvas container
     * @param {number} canvasHeight - Height of the canvas container
     */

    constructor(x, y, size, color, weight, canvasWidth, canvasHeight) {
        /** @private {number} */
        this.x = x;
        /** @private {number} */
        this.y = y;
        /** @private {number} */
        this.size = size;
        /** @private {string} */
        this.color = color;
        /** @private {number} */
        this.weight = weight;
        /** @private {number} */
        this.canvasWidth = canvasWidth;
        /** @private {number} */
        this.canvasHeight = canvasHeight;
        /** @private {number} */
        this.flowAngle = 0;
        /** @private {number} */
        this.flowSpeed = Math.random() *
            (PARTICLE_CONFIG.FLOW_SPEED_MAX - PARTICLE_CONFIG.FLOW_SPEED_MIN) +
            PARTICLE_CONFIG.FLOW_SPEED_MIN;
        /** @private {string} */
        this.destinedColor = "";
        /** @private {number} */
        this.destinedX = -1;
        /** @private {number} */
        this.destinedY = -1;
    }

    /**
     * @brief Updates position and color to match it's destined state
     * @param {CanvasRenderingContext2D} ctx - The context for the canvas
     * @returns {boolean} - Whether or not this function had an impact on the particle
     */
    moveTowardsDestinedState(ctx) {
        // Check if there is a destined point to move towards
        if (this.destinedX < 0 || this.destinedY < 0) return false;

        [this.x, this.y] = lerpPoints(this.x, this.y, this.destinedX, this.destinedY, PARTICLE_CONFIG.CLUMP_SPEED);
        this.color = lerpColors(ctx, this.color, this.destinedColor, PARTICLE_CONFIG.CLUMP_SPEED);
        return true;
    }

    /**
     * @brief Draws the particle on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    /**
     * Updates the particle position based on flow and mouse interaction
     * @param {Object} mousePosition - Current mouse coordinates
     */
    update(mousePosition, ctx) {
        // Update the clumping animation
        let isAnimating = this.moveTowardsDestinedState(ctx);
        if (isAnimating) return;
        
        // Get repel distance
        let repelDistance = PARTICLE_CONFIG.MOUSE_REPEL_DISTANCE;

        // Base movement pattern (flowing animation)
        this.flowAngle += PARTICLE_CONFIG.FLOW_ANGLE_INCREMENT;
        this.x += Math.sin(this.flowAngle) * this.flowSpeed;
        this.y += Math.cos(this.flowAngle) * this.flowSpeed;

        // Mouse interaction
        if (mousePosition.x != null && mousePosition.y != null) {
            const distance = calculateDistance(
                this.x, this.y, mousePosition.x, mousePosition.y
            );

            // If mouse is nearby, particles are repelled
            if (distance < repelDistance) {
                const angle = Math.atan2(
                    mousePosition.y - this.y,
                    mousePosition.x - this.x
                );
                const repelForce = (repelDistance - distance) /
                    PARTICLE_CONFIG.REPEL_FORCE_DIVISOR;

                this.x -= Math.cos(angle) * repelForce;
                this.y -= Math.sin(angle) * repelForce;
            }
        }

        // Keep particles on screen with a smooth transition
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.x = Math.random() * this.canvasWidth;
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.y = Math.random() * this.canvasHeight;
        }
    }

    /**
     * Connects this particle to nearby particles with gradient lines
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Array<Particle>} particles - Array of all particles
     */
    connect(ctx, particles) {
        // Check if we are doing the clumping animation
        if (this.destinedX >= 0 && this.destinedY >= 0) return;

        for (const particle of particles) {
            // Skip self-connection
            if (this === particle) continue;

            const distance = calculateDistance(
                this.x, this.y, particle.x, particle.y
            );

            if (distance < PARTICLE_CONFIG.CONNECTION_DISTANCE) {
                // Calculate opacity based on distance
                const opacity = 1 - distance / PARTICLE_CONFIG.CONNECTION_DISTANCE;

                // Create gradient line
                const gradient = createGradient(
                    ctx,
                    this.x, this.y,
                    particle.x, particle.y,
                    this.color, particle.color,
                    opacity
                );

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.size / 8;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(particle.x, particle.y);
                ctx.stroke();
            }
        }
    }
}
