import StemSegment from "./Plant.js";
import { ELEMENTS, SVG_NS } from "../constants.js";

export default class Leaf {
    /** @private The <g> that contains the entire leaf */
    element;

    /**
     * @param {StemSegment} stem - The segment to grow on
     * @param {number} side - -1 for left and 1 for right
     */
    constructor(stem, side) {
        // Path and attributes
        const paths = [
            {
                d: `
                    M 0 0 
                    C 3 3, 7 5, 10 5 
                    C 13 5, 17 2, 20 0 
                    C 17 -2, 13 -5, 10 -5 
                    C 7 -5, 3 -3, 0 0 
                    Z
                `,
                stroke: "darkgreen", fill: "green", strokeWidth: "1"
            },
            { d: "M 0 0 L 20 0", stroke: "darkgreen", strokeWidth: "1", fill: "none" },
            { d: "M 5 0 C 6 1.5, 8 3.5, 9.5 4.8", stroke: "darkgreen", strokeWidth: "1", fill: "none" },
            { d: "M 5 0 C 6 -1.5, 8 -3.5, 9.5 -4.8", stroke: "darkgreen", strokeWidth: "1", fill: "none" },
            { d: "M 12 0 C 13.5 1.5, 15.5 3, 16.5 3.8", stroke: "darkgreen", strokeWidth: "1", fill: "none" },
            { d: "M 12 0 C 13.5 -1.5, 15.5 -3, 16.5 -3.8", stroke: "darkgreen", strokeWidth: "1", fill: "none" }
        ];

        // Create the element
        const leaf = document.createElementNS(SVG_NS, "g");
        paths.forEach(data => {
            const path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("d", data.d);
            path.setAttribute("stroke", data.stroke);
            path.setAttribute("stroke-width", data.strokeWidth);
            path.setAttribute("fill", data.fill);
            leaf.appendChild(path);
        })


        // Set class members
        this.element = leaf;

        // Calculate the position of the leaf
        const attachPointRatio = Math.random();
        const leafStartX = stem.startX + stem.dirX * attachPointRatio;
        const leafStartY = stem.startY + stem.dirY * attachPointRatio;

        // Animate the leaf appearing
        gsap.set(leaf, {
            transformOrigin: "left",
            x: leafStartX,
            y: leafStartY,
            rotation: 0,
            scale: 0,
            opacity: 0
        });
7
        gsap.to(leaf, {
            scale: Math.random() * 0.4 + 0.3,
            opacity: 1,
            rotation: -stem.rotation * 180 / Math.PI + side * 60,
            duration: 0.7,
            ease: "back.out(2)"
        });
    }

    /**
     * Wither away
     */
    Wither() {
        gsap.to(this.element, {
            opacity: 0,
            y: 0,
            duration: 1.5,
            rotation: Math.random() * 720 - 360,
            onComplete: () => {
                this.element.remove();
            }
        });
    }
}
