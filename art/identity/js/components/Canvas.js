
/**
 * Canvas component responsible for managing the canvas element
 * and coordinating particle animations
 * @module Canvas
 */
import { PARTICLE_CONFIG, COLOR_PALETTE } from '../core/constants.js';
import { Particle } from './Particle.js';
import { calculateColorValues, randomBetween } from '../core/utils.js';

/**
 * Canvas class handles the background canvas animation and particle system
 */
export class Canvas {
    /**
     * Create a new Canvas instance
     * @param {string} canvasId - The ID of the canvas DOM element
     */
    constructor(canvasId) {
        /** @private {HTMLCanvasElement} */
        this.canvas = document.getElementById(canvasId);
        /** @private {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d');
        /** @private {number} */
        this.width = 0;
        /** @private {number} */
        this.height = 0;
        /** @private {Array<Particle>} */
        this.particles = [];
        /** @private {Object} */
        this.mousePosition = { x: null, y: null };
        /** @public {boolean} */
        this.animatingClump = false;
        /** @private {boolean} If greater than 0 then the particles are to be replaced by the image*/
        this.imageX = -1;
        /** @private {boolean} */
        this.imageY = -1;
        /** @private {Image} The image to replace the particles with*/
        this.image = null;
        /** @private {Array<Particle>} A list of the particles currently being animated */
        this.particleList = [];
        /** @private {boolean} Whether or not the canvas is ready for finishing the particle clump animation */
        this.readyForFinishClump = false;

        // Set initial canvas size
        this.resize();

        // Setup mouse tracking
        this._setupMouseTracking();
    }

    /**
     * Sets up mouse position tracking
     * @private
     */
    _setupMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.x;
            this.mousePosition.y = e.y;
        });
    }

    /**
     * Resizes the canvas to match the window size and reinitializes particles
     */
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this._initParticles();
    }

    /**
     * Initializes the particle system
     * @private
     */
    _initParticles() {
        this.particles = [];

        const particleCount = Math.floor(
            this.width * this.height / PARTICLE_CONFIG.PARTICLE_DENSITY_DIVISOR
        );

        for (let i = 0; i < particleCount; i++) {
            const size = randomBetween(PARTICLE_CONFIG.MIN_SIZE, PARTICLE_CONFIG.MAX_SIZE);
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
            const weight = Math.random() * 2 + 1;

            this.particles.push(new Particle(
                x, y, size, color, weight, this.width, this.height
            ));
        }
    }

    /**
     * Starts the animation loop
     */
    startAnimation() {
        this._animate();
    }

    /**
     * Animation loop
     * @private
     */
    _animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Check if we draw an image instead of particles
        if (this.imageX >= 0 && this.imageY >= 0)
        {
            this.ctx.drawImage(this.image, this.imageX + 10, this.imageY + 10, 260, 200);
            requestAnimationFrame(this._animate.bind(this));
            return;
        }

        // Update and draw particles
        for (const particle of this.particles) {
            particle.update(this.mousePosition, this.ctx);
            particle.draw(this.ctx);
        }

        // Connect particles with lines
        for (const particle of this.particles) {
            particle.connect(this.ctx, this.particles);
        }

        requestAnimationFrame(this._animate.bind(this));
    }

    /**
     * Start the animation of particles clumping together
     */
    async animateParticleClumps({ clientX, clientY }) {
        if (this.animatingClump) return;
        this.animatingClump = true;

        const sleep = async ms => new Promise(res => setTimeout(res, ms));
        const getImage = async url => new Promise((res, rej) => {
            let image = new Image();
            image.src = url;

            image.addEventListener("error", rej);
            image.addEventListener("load", () => {
                res(image);
            });
        });

        let particleCount = this.particles.length * PARTICLE_CONFIG.CLUMP_PERCENT;
        let particleList = this.particles.sort(() => 0.5 - Math.random()).slice(0, particleCount);
        this.particleList = particleList;

        // Create a random width and height of the box
        let width = 150;
        let height = 100;

        // Calculate grid dimensions
        const columns = Math.ceil(Math.sqrt(particleCount));
        const rows = Math.ceil(particleCount / columns);

        // Calculate spacing between particles
        const spacingX = width / (columns + 1) + 7;
        const spacingY = height / (rows + 1) + 7;

        // Get the color information about the particles
        const image = await getImage(`images/artwork${Math.floor(Math.random() * PARTICLE_CONFIG.IMAGE_LIST) + 1}.jpg`);
        this.image = image;
        let colorInfo = calculateColorValues(image, particleCount);

        // Go through every particle and clump it around the cursor (with a random color)
        particleList.forEach((particle, index) => {
            // Calculate row and column position
            const row = Math.floor(index / columns);
            const col = index % columns;

            // Set particle position with some padding from edges
            particle.destinedX = spacingX * (col + 1) + clientX;
            particle.destinedY = spacingY * (row + 1) + clientY;

            particle.size = 5;

            // Set the color of the particle
            particle.destinedColor = colorInfo[index];
        });

        // Blur the canvas
        await sleep(1500);
        this.canvas.style.transition = "1s";
        this.canvas.style.filter = "blur(20px)";

        // Replace the particles with the image
        await sleep(500);
        this.imageX = clientX;
        this.imageY = clientY;

        // Unblur the canvas
        this.canvas.style.transition = "500ms";
        this.canvas.style.filter = "blur(0px)";

        // Ready for finish!
        this.readyForFinishClump = true;
    }

    /**
     * Finishes the particle clump animation
     * Should run when the mouse is clicked a second time
     */
    async finishParticleClumps() {
        const sleep = async ms => new Promise(res => setTimeout(res, ms));

        // Get the particle list
        let particleList = this.particleList;

        // Check if the animation has actually started
        if (!this.readyForFinishClump) return;

        // Wait a little
        //await sleep(500);

        // Move all the points to random
        this.image = null;
        this.imageX = -1;
        this.imageY = -1;

        particleList.forEach((particle, index) => {
            particle.destinedX = Math.random() * this.canvas.width;
            particle.destinedY = Math.random() * this.canvas.height;
            particle.size = randomBetween(PARTICLE_CONFIG.MIN_SIZE, PARTICLE_CONFIG.MAX_SIZE);
        });
        
        // Unblur the canvas
        this.canvas.style.transition = "100ms";
        this.canvas.style.filter = "blur(0px)";

        // Reset all of the points
        await sleep(1000);
        particleList.forEach((particle, index) => {
            particle.destinedX = -1;
            particle.destinedY = -1;
        });

        this.animatingClump = false;
        this.readyForFinishClump = false;
    }

    /**
     * Gets the current set of particles
     * @returns {Array<Particle>} The array of particles
     */
    getParticles() {
        return this.particles;
    }
}
