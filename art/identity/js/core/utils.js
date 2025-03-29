/**
 * Utility functions used throughout the application
 * @module utils
 */

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
export function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Calculates the distance between two points
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {number} Distance between the points
 */
export function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Creates a linear gradient between two points and colors
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x1 - X coordinate of start point
 * @param {number} y1 - Y coordinate of start point
 * @param {number} x2 - X coordinate of end point
 * @param {number} y2 - Y coordinate of end point
 * @param {string} color1 - Start color (rgb format)
 * @param {string} color2 - End color (rgb format)
 * @param {number} opacity - Opacity to apply to both colors
 * @returns {CanvasGradient} The created gradient
 */
export function createGradient(ctx, x1, y1, x2, y2, color1, color2, opacity) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, color1.replace(')', `, ${opacity})`).replace('rgb', 'rgba'));
    gradient.addColorStop(1, color2.replace(')', `, ${opacity})`).replace('rgb', 'rgba'));
    return gradient;
}

/**
 * Converts RGB values to the form 'rgb(r, g, b)'
 * @param {number} r - Red value of color
 * @param {number} g - Green value of color
 * @param {number} b - Blue value of color
 * @returns {String} - Color in the form 'rgb(r,g,b)'
 */
export function colorToString(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`
}

/**
 * Generates a random RGB color
 * @returns {string} Random RGB color in format 'rgb(r, g, b)'
 */
export function randomRGBColor() {
    return colorToString(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    );
}

/**
 * Lerp between two number
 * @param {number} a- Starting point
 * @param {number} b - Destination point
 * @param {number} t - The percentage to inerpolate (0 to 1)
 * @returns {number}
 */
export function lerp(a, b, t) {
    return t * b + (1 - t) * a;
}

/**
 * Calculates the linear interpolation between two points
 * @param {number} x1 - X coordinate of current point
 * @param {number} y1 - Y coordinate of current point
 * @param {number} x2 - X coordinate of destination point
 * @param {number} y2 - Y coordinate of destination point
 * @param {number} t - The percentage to interpolate from start point to destination point (between 0 and 1)
 * @returns {Object}
 */
export function lerpPoints(x1, y1, x2, y2, t) {
    return [
        lerp(x1, x2, t),
        lerp(y1, y2, t)
    ];
}

/**
 * Calculate RGB values given a color string
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} color - The color string to transform (e.g rgb(125, 23, 174) #123456, etc...)
 * @returns {Object} - In the form { r, g, b }
 */
export function calculateColorRGB(ctx, color) {
    // Check if it is in the form 'rgb(r, g, b)'
    if (color.substring(0, 4) == 'rgb(') {
        let result = color.split(',');
        return {
            r: parseInt(result[0].split("(")[1]),
            g: parseInt(result[1]),
            b: parseInt(result[2])
        }
    } else if (color[0] == "#") {
        // Get the RGB value from fillStyle
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ctx.fillStyle);

        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    } else {
        throw new Error("Could not parse color " + color + "!");
    }
}

/**
 * Linear interpolate between two colors
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {String} color1 - The current color
 * @param {String} color2 - The destined color
 * @param {number} t - The percentage to interpolate (between 0 and 1)
 * @returns {String} - Color in the form 'rgb(r, g, b)'
 */
export function lerpColors(ctx, color1, color2, t) {
    // Calculate the RGB values of both colors
    let color1RGB = calculateColorRGB(ctx, color1);
    let color2RGB = calculateColorRGB(ctx, color2);

    return colorToString(
        lerp(color1RGB.r, color2RGB.r, t),
        lerp(color1RGB.g, color2RGB.g, t),
        lerp(color1RGB.b, color2RGB.b, t)
    );
}

/**
 * Calculate the color of the particles building up the image
 * @param {Image} image - The image the particles will try to depict
 * @param {number} particleCount - The number of particles that will make up the particle
 * @returns {Array{string}} - A list of color strings in the form 'rgb(r, g, b)'
 */
export function calculateColorValues(image, particleCount) {
    // Input validation
    if (!image || particleCount <= 0) {
        throw new Error("Invalid parameters in calculateColorValues");
    }

    // Create an offscreen canvas to draw the image
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = image.width;
    offscreenCanvas.height = image.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    // Draw the image on the offscreen canvas
    offscreenCtx.drawImage(image, 0, 0, image.width, image.height);

    // Get image data
    const imageData = offscreenCtx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data; // RGBA array

    // Array to store color values
    const colorValues = new Array(particleCount);

    // Calculate sampling points based on particle count
    const samplesPerRow = Math.ceil(Math.sqrt(particleCount));
    const samplesPerCol = Math.ceil(particleCount / samplesPerRow);

    // Calculate step size for sampling
    const stepX = image.width / (samplesPerRow + 1);
    const stepY = image.height / (samplesPerCol + 1);

    // Sample colors from the image
    for (let i = 0; i < particleCount; i++) {
        // Calculate position in grid
        const row = Math.floor(i / samplesPerRow);
        const col = i % samplesPerRow;

        // Calculate pixel coordinates
        const x = Math.floor(stepX * (col + 1));
        const y = Math.floor(stepY * (row + 1));

        // Calculate index in the RGBA array (4 values per pixel)
        const index = (y * image.width + x) * 4;

        // Get RGB values and convert to single number
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        // Ignore alpha (data[index + 3]) for now
        
        colorValues[i] = colorToString(r, g, b);
    }

    return colorValues;
}
