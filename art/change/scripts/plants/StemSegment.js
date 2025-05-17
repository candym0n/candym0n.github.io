import { ANIMATION, SVG_NS } from "../constants.js"
import Leaf from "./Leaf.js";

export class StemSegment {
    element;

    startX; /** @private */
    startY; /** @private */

    rotation;  /** @private The angle between the segment and X-axis (counterclockwise) */
    thickness; /** @private The thickness of the line segment that is the stem segment */

    leafRight; /** @private The leaf on the right side */
    leafLeft;  /** @private The leaf on the left side */

    /**
     * 
     * @param {HTMLElement} parent   - For flowers, the element of the flower, and otherwise the <g> where all the leaves are added
     * @param {number} x             - X-coordinate of end of segment
     * @param {number} y             - Y-coordinate of start of segment
     * @param {number} rotation      - Angle to X axis counterclockwise
     * @param {boolean} flower       - Is this segment the base of a flower (no leaves, flower at tip)
     * @returns 
     */
    constructor(parent, x, y, rotation, flower) {
        this.startX = x;
        this.startY = y;

        this.thickness = 3;
        this.rotation = rotation;

        // Create the segment
        const segment = document.createElementNS(SVG_NS, "line");
        segment.setAttribute("x1", this.startX);
        segment.setAttribute("y1", this.startY);
        segment.setAttribute("x2", this.startX);
        segment.setAttribute("y2", this.startY);
        segment.setAttribute("stroke", "green");
        segment.setAttribute("stroke-width", this.thickness);
        this.element = segment;

        // Animate the stem to slowly grow in
        gsap.to(segment, {
            attr: { x2: this.startX + this.dirX, y2: this.startY + this.dirY },
            duration: ANIMATION.STEM_GROW_DUR,
            ease: "power2.out",
            transformOrigin: "bottom"
        });

        if (flower) {
            gsap.set(parent, {
                x: this.startX + this.dirX,
                y: this.startY + this.dirY,
                opacity: 1,
                scale: 0
            });

            gsap.killTweensOf(parent);

            gsap.to(parent, {
                scale: 1,
                duration: ANIMATION.FLOWER_GROW_DUR
            });

            return;
        }

        // Create the leaves
        this.rightLeaf = new Leaf(this, 1);
        this.leftLeaf = new Leaf(this, -1);
        parent.appendChild(this.rightLeaf.element);
        parent.appendChild(this.leftLeaf.element);
    }

    get dirX() {
        return ANIMATION.SEGMENT_LENGTH * Math.cos(this.rotation);
    }

    get dirY() {
        return -ANIMATION.SEGMENT_LENGTH * Math.sin(this.rotation);
    }

    /**
     * Wither away this stem and any attached leaves
     */
    Wither() {
        if (this.rightLeaf)
            this.rightLeaf.Wither();

        if (this.leftLeaf)
            this.leftLeaf.Wither();

        gsap.to(this.element, {
            attr: {
                x2: this.element.x1.animVal.value,
                y2: this.element.y1.animVal.value,
            },
            duration: ANIMATION.STEM_WITHER_DUR,
            onComplete: () => {
                this.element.remove();
            }
        });
    }
}   
