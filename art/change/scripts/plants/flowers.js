import { SVG_NS } from "../constants.js"

export default class Flowers {
    /**
     * Creates an SVG group element containing a sunflower drawing.
     * The sunflower is centered at (0,0).
     *
     * @param {object} options - Configuration options for the sunflower.
     * @param {number} [options.radius=50] - The approximate overall radius of the sunflower.
     * @param {number} [options.centerRadius=15] - The radius of the dark center of the sunflower.
     * @param {number} [options.numPetals=18] - The number of petals on the sunflower.
     * @param {string} [options.centerColor="#4A2E1E"] - The color of the sunflower center.
     * @param {string} [options.petalBaseColor="#FFD700"] - The color of the petals near the center.
     * @param {string} [options.petalTipColor="#FFA500"] - The color of the petals at their tips.
     * @returns {SVGGElement} A <g> element containing the sunflower SVG.
     */
    static createSunflower(options = {}) {
        const {
            radius = 50,
            centerRadius = radius * 0.3, // Default center is 30% of overall radius
            numPetals = 18,
            centerColor = "#4A2E1E", // Dark brown
            petalBaseColor = "#FFD700", // Gold
            petalTipColor = "#FFA500"  // Orange
        } = options;

        const g = document.createElementNS(SVG_NS, "g");

        // --- Create Definitions (Gradients) ---
        const defs = document.createElementNS(SVG_NS, "defs");

        // Radial gradient for the center
        const centerGradient = document.createElementNS(SVG_NS, "radialGradient");
        centerGradient.setAttribute("id", "sunflowerCenterGradient");
        centerGradient.setAttribute("cx", "50%");
        centerGradient.setAttribute("cy", "50%");
        centerGradient.setAttribute("r", "50%");
        centerGradient.setAttribute("fx", "50%");
        centerGradient.setAttribute("fy", "50%");

        const stop1 = document.createElementNS(SVG_NS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#6F4F28"); // Lighter brown for highlight
        centerGradient.appendChild(stop1);

        const stop2 = document.createElementNS(SVG_NS, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", centerColor); // Darker brown for the edges
        centerGradient.appendChild(stop2);

        defs.appendChild(centerGradient);

        // Linear gradient for petals
        const petalGradient = document.createElementNS(SVG_NS, "linearGradient");
        petalGradient.setAttribute("id", "sunflowerPetalGradient");
        petalGradient.setAttribute("x1", "0%");
        petalGradient.setAttribute("y1", "0%");
        petalGradient.setAttribute("x2", "0%"); // Gradient goes vertically along the petal
        petalGradient.setAttribute("y2", "100%");

        const pStop1 = document.createElementNS(SVG_NS, "stop");
        pStop1.setAttribute("offset", "0%");
        pStop1.setAttribute("stop-color", petalTipColor); // Tip color at the top
        petalGradient.appendChild(pStop1);

        const pStop2 = document.createElementNS(SVG_NS, "stop");
        pStop2.setAttribute("offset", "100%");
        pStop2.setAttribute("stop-color", petalBaseColor); // Base color at the bottom
        petalGradient.appendChild(pStop2);

        defs.appendChild(petalGradient);
        g.appendChild(defs);

        // --- Create Center ---
        const centerCircle = document.createElementNS(SVG_NS, "circle");
        centerCircle.setAttribute("cx", "0");
        centerCircle.setAttribute("cy", "0");
        centerCircle.setAttribute("r", centerRadius.toString());
        centerCircle.setAttribute("fill", "url(#sunflowerCenterGradient)");
        g.appendChild(centerCircle);

        // --- Create Petals ---
        const angleStep = 360 / numPetals;

        // Petal shape definition (using a path)
        // Points relative to the center (0,0) for a petal pointing upwards initially
        const petalBaseWidth = radius * 0.8; // Width at the base near the center
        const petalBaseHeight = radius * 0.5; // Distance from center to base points Y
        const petalTipRadius = radius * 0.5;      // Distance from center to tip

        // Adjust control points to create a nice curve
        const cp1_x = petalBaseWidth * 0.8;
        const cp1_y = -petalTipRadius * 0.4;
        const cp2_x = petalBaseWidth * 0.8;
        const cp2_y = -petalTipRadius * 0.4;


        // Define the path data for a single petal
        // M = MoveTo, Q = Quadratic Bezier Curve
        // Start at bottom left base point, curve to tip, curve back to bottom right base point
        const petalPathData = `
        M ${-petalBaseWidth / 2}, ${-petalBaseHeight}
        Q ${-cp1_x}, ${-cp1_y}, 0, ${-petalTipRadius}
        Q ${cp2_x}, ${-cp2_y}, ${petalBaseWidth / 2}, ${-petalBaseHeight}
        Z
    `.trim(); // Use trim() to remove leading/trailing whitespace

        for (let i = 0; i < numPetals; i++) {
            const petal = document.createElementNS(SVG_NS, "path");
            petal.setAttribute("d", petalPathData);
            petal.setAttribute("fill", "url(#sunflowerPetalGradient)");
            petal.setAttribute("stroke", "#000"); // Optional: add a stroke
            petal.setAttribute("stroke-width", "0.5"); // Optional: stroke width

            // Rotate each petal around the center (0,0)
            const rotation = i * angleStep;
            petal.setAttribute("transform", `rotate(${rotation}, 0, 0)`);

            g.appendChild(petal);
        }

        return g;
    }

    /**
     * Creates an SVG group element containing a peony drawing.
     * The peony is centered at (0,0) and aims for a dense, full look.
     *
     * @param {object} options - Configuration options for the peony.
     * @param {number} [options.radius=50] - The approximate overall radius of the peony.
     * @param {Array<object>} [options.layers] - Configuration for each petal layer.
     * @param {number} [options.layers[].radiusFactor] - Scaling factor for petal size in this layer relative to the overall radius.
     * @param {number} [options.layers[].numPetals] - Number of petals in this layer.
     * @param {Array<{offset: string, color: string}>} [options.layers[].colorStops] - Color stops for the linear gradient applied to this layer's petals.
     * @param {number} [options.petalBaseWidthRatio=0.3] - Ratio of petal base width to layer radius factor.
     * @param {number} [options.petalTipLengthRatio=1] - Ratio of petal tip distance to layer radius factor.
     * @param {number} [options.petalControlPointHorizontalRatio=0.6] - Horizontal control point influence ratio.
     * @param {number} [options.petalControlPointVerticalRatio=0.4] - Vertical control point influence ratio.
     * @returns {SVGGElement} A <g> element containing the peony SVG.
     */
    static createPeony(options = {}) {
        const {
            radius = 50,
            layers = [
                // Example default layers (adjust for desired look)
                { radiusFactor: 0.3, numPetals: 8, colorStops: [{ offset: '0%', color: '#FFECB3' }, { offset: '100%', color: '#FFC107' }] }, // Center stamens/small petals
                { radiusFactor: 0.6, numPetals: 12, colorStops: [{ offset: '0%', color: '#F8BBD0' }, { offset: '100%', color: '#E91E63' }] }, // Inner petals (pinkish)
                { radiusFactor: 0.9, numPetals: 18, colorStops: [{ offset: '0%', color: '#F48FB1' }, { offset: '100%', color: '#C2185B' }] }, // Middle petals
                { radiusFactor: 1.2, numPetals: 24, colorStops: [{ offset: '0%', color: '#F06292' }, { offset: '100%', color: '#880E4F' }] }, // Outer petals (larger, darker)
            ],
            petalBaseWidthRatio = 0.3, // Controls how wide the petal is at its base
            petalTipLengthRatio = 1, // Controls how far the petal tip reaches
            petalControlPointHorizontalRatio = 0.6, // Influences the horizontal spread of the curve
            petalControlPointVerticalRatio = 0.4 // Influences the vertical pull of the curve
        } = options;

        const SVG_NS = "http://www.w3.org/2000/svg";
        const g = document.createElementNS(SVG_NS, "g");
        const defs = document.createElementNS(SVG_NS, "defs");
        g.appendChild(defs);

        // Function to create a petal path data string
        // This path is defined relative to a base size (radiusFactor = 1), pointing upwards
        const createPetalPathData = (layerRadius) => {
            const baseWidth = layerRadius * petalBaseWidthRatio;
            const tipLength = layerRadius * petalTipLengthRatio;

            // Adjust control points based on ratios and layer size
            const cpHorizontal = layerRadius * petalControlPointHorizontalRatio;
            const cpVertical = layerRadius * petalControlPointVerticalRatio;

            // M = MoveTo, C = Cubic Bezier Curve
            // Start at bottom-left base, curve to tip, curve back to bottom-right base
            return `
            M ${-baseWidth / 2}, 0
            C ${-cpHorizontal}, ${-cpVertical}, ${-cpHorizontal * 0.5}, ${-tipLength * 0.8}, 0, ${-tipLength}
            C ${cpHorizontal * 0.5}, ${-tipLength * 0.8}, ${cpHorizontal}, ${-cpVertical}, ${baseWidth / 2}, 0
            Z
        `.trim();
        };

        // Draw layers from outer to inner to ensure overlap looks correct
        const sortedLayers = [...layers].sort((a, b) => b.radiusFactor - a.radiusFactor);

        sortedLayers.forEach((layer, layerIndex) => {
            const layerRadius = radius * layer.radiusFactor;
            const numPetals = layer.numPetals;
            const angleStep = 360 / numPetals;

            // Create a unique gradient for this layer
            const gradientId = `peonyPetalGradient_${layerIndex}`;
            const petalGradient = document.createElementNS(SVG_NS, "linearGradient");
            petalGradient.setAttribute("id", gradientId);
            // Position gradient along the approximate length of the petal when pointing upwards
            petalGradient.setAttribute("x1", "0%");
            petalGradient.setAttribute("y1", "100%"); // Base of petal
            petalGradient.setAttribute("x2", "0%");
            petalGradient.setAttribute("y2", "0%");   // Tip of petal

            layer.colorStops.forEach(stop => {
                const stopElement = document.createElementNS(SVG_NS, "stop");
                stopElement.setAttribute("offset", stop.offset);
                stopElement.setAttribute("stop-color", stop.color);
                petalGradient.appendChild(stopElement);
            });
            defs.appendChild(petalGradient);

            const petalPathData = createPetalPathData(layerRadius);

            for (let i = 0; i < numPetals; i++) {
                const petal = document.createElementNS(SVG_NS, "path");
                petal.setAttribute("d", petalPathData);
                petal.setAttribute("fill", `url(#${gradientId})`);
                // Optional: Add a subtle stroke to define petal edges
                // petal.setAttribute("stroke", "#000");
                // petal.setAttribute("stroke-width", "0.2");
                // petal.setAttribute("stroke-opacity", "0.5");


                // Rotate each petal around the center (0,0)
                // Add slight random rotation for a more natural look
                const rotation = i * angleStep + (Math.random() - 0.5) * (angleStep * 0.3); // Add up to +/- 15% randomness
                // Add a slight vertical translation outwards for overlap effect
                const translateY = -layerRadius * 0.1; // Adjust this value for desired overlap
                petal.setAttribute("transform", `rotate(${rotation}, 0, 0) translate(0, ${translateY})`);


                g.appendChild(petal);
            }
        });


        // Optional: Add a very small, subtle highlight in the absolute center if desired
        // This might help ground the flower visually
        const centerHighlightRadius = radius * 0.05;
        if (centerHighlightRadius > 1) {
            const centerHighlight = document.createElementNS(SVG_NS, "circle");
            centerHighlight.setAttribute("cx", "0");
            centerHighlight.setAttribute("cy", "0");
            centerHighlight.setAttribute("r", centerHighlightRadius.toString());
            centerHighlight.setAttribute("fill", "#FFFFFF"); // Or a light yellow/pink
            centerHighlight.setAttribute("opacity", "0.6"); // Make it semi-transparent
            g.appendChild(centerHighlight);
        }


        return g;
    }
    /**
     * Creates an SVG group element containing a detailed rose drawing.
     * The rose is centered at (0,0) and built with multiple layers of petals.
     *
     * @param {object} options - Configuration options for the rose.
     * @param {number} [options.radius=50] - The approximate overall radius of the rose.
     * @param {object} [options.colors] - Color scheme for the rose petals.
     * @param {string} [options.colors.base="#E57373"] - Base color for the petals (e.g., a mid-tone red).
     * @param {string} [options.colors.highlight="#FFCDD2"] - Highlight color (e.g., a lighter pink/red).
     * @param {string} [options.colors.shadow="#B71C1C"] - Shadow color (e.g., a darker red).
     * @param {Array<object>} [options.layers] - Configuration for each petal layer.
     * @param {number} [options.layers[].radiusRatio] - Scaling factor for petal size in this layer relative to the overall radius.
     * @param {number} [options.layers[].numPetals] - Number of petals in this layer.
     * @param {'inner' | 'middle' | 'outer'} [options.layers[].shapePreset] - Type of petal shape to use ('inner', 'middle', or 'outer').
     * @param {Array<{offset: string, color: string}>} [options.layers[].colorStops] - Custom color stops for the gradient on this layer (overrides default color mixing).
     * @param {number} [options.layers[].rotationRandomness=0] - Maximum random degrees to add to petal rotation in this layer.
     * @param {number} [options.layers[].positionRandomness=0] - Maximum random translation (in radius units) to add to petal position.
     * @returns {SVGGElement} A <g> element containing the rose SVG.
     */
    static createRose(options = {}) {
        const {
            radius = 50,
            colors = {
                base: "#E57373",    // Light Red
                highlight: "#FFCDD2", // Pale Pink
                shadow: "#B71C1C",  // Dark Red
            },
            layers = [
                // Default layers for a classic rose look
                { radiusRatio: 0.2, numPetals: 5, shapePreset: 'inner', rotationRandomness: 30 }, // Tightly curled center
                { radiusRatio: 0.4, numPetals: 7, shapePreset: 'inner', rotationRandomness: 20 }, // Slightly larger inner
                { radiusRatio: 0.6, numPetals: 10, shapePreset: 'middle', rotationRandomness: 15 }, // Opening middle
                { radiusRatio: 0.8, numPetals: 12, shapePreset: 'middle', rotationRandomness: 10 }, // More open middle
                { radiusRatio: 1.0, numPetals: 15, shapePreset: 'outer', rotationRandomness: 5 },  // Outer, larger petals
            ],
        } = options;

        const g = document.createElementNS(SVG_NS, "g");
        const defs = document.createElementNS(SVG_NS, "defs");
        g.appendChild(defs);

        // Define complex petal shapes relative to a base size (e.g., height of 1 unit)
        // These are illustrative complex paths using Cubic Bezier Curves (C)
        // M = MoveTo, C = Cubic Bezier, Z = ClosePath
        const petalShapes = {
            // Tightly curled inner petal
            inner: `M 0,0 C 0.1,-0.3, 0.3,-0.7, 0.2,-1 C 0.1,-0.8, -0.1,-0.4, 0,0 Z`, // Simple curl
            // More open middle petal with some curve
            middle: `M -0.3,0 C -0.5,-0.4, -0.4,-0.9, 0,-1 C 0.4,-0.9, 0.5,-0.4, 0.3,0 C 0.2,0.1, -0.2,0.1, -0.3,0 Z`, // Basic rounded
            // Wide, more open outer petal
            outer: `M -0.5,0 C -0.8,-0.4, -0.7,-1.1, 0,-1 C 0.7,-1.1, 0.8,-0.4, 0.5,0 C 0.3,0.2, -0.3,0.2, -0.5,0 Z`, // Wider rounded
            // Add more complex shapes if needed for greater detail
            inner_complex: `M 0.05,0.05 C 0.1,-0.2, 0.2,-0.5, 0.1,-0.7 C 0.05,-0.6 -0.05,-0.4 0,0 Z`, // Very tight central curl
            middle_complex: `M -0.2,0 C -0.4,-0.3, -0.3,-0.8, 0,-0.9 C 0.3,-0.8, 0.4,-0.3, 0.2,0 C 0.1,0.1 -0.1,0.1 -0.2,0 Z`, // Standard slightly open petal
            outer_complex: `M -0.4,0 C -0.7,-0.3, -0.6,-1, 0,-1.1 C 0.6,-1, 0.7,-0.3, 0.4,0 C 0.2,0.1 -0.2,0.1 -0.4,0 Z` // Large outer petal
        };


        // Draw layers from outer to inner for correct overlap and depth
        const sortedLayers = [...layers].sort((a, b) => b.radiusRatio - a.radiusRatio);

        sortedLayers.forEach((layer, layerIndex) => {
            const layerRadius = radius * layer.radiusRatio;
            const numPetals = layer.numPetals;
            const angleStep = 360 / numPetals;

            // Get petal path data based on shape preset
            const rawPathData = petalShapes[layer.shapePreset] || petalShapes.middle; // Default to middle if preset is unknown

            // Create a unique linear gradient for this layer
            const gradientId = `rosePetalGradient_${layerIndex}`;
            const petalGradient = document.createElementNS(SVG_NS, "linearGradient");
            petalGradient.setAttribute("id", gradientId);
            // Gradient angle - can be adjusted for lighting direction
            petalGradient.setAttribute("x1", "0%");
            petalGradient.setAttribute("y1", "100%"); // From bottom-center of unrotated petal
            petalGradient.setAttribute("x2", "0%");
            petalGradient.setAttribute("y2", "0%"); // To top-center of unrotated petal

            // Use custom color stops if provided, otherwise generate from base/highlight/shadow
            const layerColorStops = layer.colorStops || [
                { offset: '0%', color: colors.shadow },     // Base/shadow color
                { offset: '50%', color: colors.base },      // Mid-tone color
                { offset: '100%', color: colors.highlight } // Tip/highlight color
            ];

            layerColorStops.forEach(stop => {
                const stopElement = document.createElementNS(SVG_NS, "stop");
                stopElement.setAttribute("offset", stop.offset);
                stopElement.setAttribute("stop-color", stop.color);
                petalGradient.appendChild(stopElement);
            });
            defs.appendChild(petalGradient);

            for (let i = 0; i < numPetals; i++) {
                const petal = document.createElementNS(SVG_NS, "path");

                // Scale the path data to the layer radius
                // The base path is roughly 1 unit high, so scale by layerRadius
                // Also, petals are positioned away from the center, so translate as well
                const scaleFactor = layerRadius * 1.2; // Adjust scale factor based on desired petal size relative to layer radius
                const translateY = -layerRadius * 0.3; // Distance from the center (adjust for desired overlap)


                // Apply transformations directly in the path 'd' attribute for more control over scaling origin
                // Or apply transform attribute to the path element - easier for rotation and translation

                petal.setAttribute("fill", `url(#${gradientId})`);
                petal.setAttribute("stroke", colors.shadow); // Subtle dark outline
                petal.setAttribute("stroke-width", "0.2");
                petal.setAttribute("stroke-linejoin", "round");


                // Calculate position and rotation
                const baseRotation = i * angleStep;
                const randomRotation = (Math.random() - 0.5) * (layer.rotationRandomness || 0);
                const rotation = baseRotation + randomRotation;

                // Add random positioning for a more natural, less perfect look
                const randomTranslateX = (Math.random() - 0.5) * (layer.positionRandomness || 0) * radius;
                const randomTranslateY = (Math.random() - 0.5) * (layer.positionRandomness || 0) * radius;


                // Apply scaling, rotation, and translation
                // Order of transformations matters: scale, then rotate, then translate
                petal.setAttribute("transform",
                    `
                 translate(${randomTranslateX}, ${randomTranslateY})
                 rotate(${rotation}, 0, 0)
                 translate(0, ${translateY})
                 scale(${scaleFactor})
                 `
                );

                // Set the scaled path data
                petal.setAttribute("d", rawPathData);


                g.appendChild(petal);
            }
        });

        return g;
    }
}
