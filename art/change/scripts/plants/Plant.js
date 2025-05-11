import { ELEMENTS, SVG_NS } from "../constants.js";
import Leaf from "./Leaf.js";
import { StemSegment } from "./StemSegment.js";

export default class Plant {
    leavesElement; /** The <g> that contains the leaves */
    flowerElement; /** The <g> that contains the flower */

    stems;        /** @private A list of StemSegment's */
    stemsElement; /** The <g> that contains the stem segments */

    bend; /** @private The amount of radians each segment bends */

    x;
    y;

    max; /** @private The total number of segments the plant can support */

    constructor(x, y, flowerGroup, bend = 0, max = 5) {
        // Initialize the position of the plant
        this.x = x;
        this.y = y;

        // Initialize other variables
        this.bend = bend;
        this.max = max;

        // Initialize empty arrays
        this.stems = [];

        // Create the <g> that contains the plant and friends
        const plant = document.createElementNS(SVG_NS, "g");
        this.leavesElement = document.createElementNS(SVG_NS, "g");
        this.stemsElement = document.createElementNS(SVG_NS, "g");
        this.flowerElement = flowerGroup;
        gsap.set(this.flowerElement, {
            scale: 0,
            transformOrigin: "center"
        })
        plant.appendChild(this.stemsElement);
        plant.appendChild(this.leavesElement);
        plant.appendChild(this.flowerElement);
        document.querySelector(ELEMENTS.PLANTS).appendChild(plant);

        // Set an initial stem
        // this.AppendToStem(new StemSegment(this.leavesElement, x, y, Math.PI / 2));
    }

    /**
     * Grows the plant by one level
     * @returns {boolean} - Whether or not the flower is already full
     */
    GrowPlant() {
        // Check that we have not reached the max
        if (this.stems.length > this.max) return true;

        const accumulated = this.stems.reduce(((accumulator, current) => [
            accumulator[0] + current.dirX,
            accumulator[1] + current.dirY,
            accumulator[2] + this.bend
        ]).bind(this), [this.x, this.y, Math.PI / 2]);

        // Accumulate stem offsets to get a new stem offset
        let newSegment = new StemSegment(
            this.stems.length == this.max ? this.flowerElement : this.leavesElement,
            accumulated[0],
            accumulated[1],
            accumulated[2],
            this.stems.length == this.max
        );

        this.AppendToStem(newSegment);

        return false;
    }

    /**
     * Removes the last layer of the plant
     * (Whether thats a flower or a stem segment)
     * @returns {boolean} Whether or not the plant is already empty
     */
    WitherPlant() {
        // Check that we have something to wither
        if (this.stems.length == 0) return;

        // Wither the flower if we have it
        if (this.stems.length > this.max) {
            gsap.to(this.flowerElement, {
                opacity: 0,
                y: 0,
                duration: 0.7
            });
        }

        // Remove the last stem segment
        this.stems.pop().Wither();
    }

    /**
     * Append a segment to the stem segments
     * @param {StemSegment} segment - The segment to be added
     */
    AppendToStem(segment) {
        this.stems.push(segment);
        this.stemsElement.appendChild(segment.element);
    }

    /**
     * @returns {number} The X-coordinate of the base of the plant
     */
    get StemBaseX() {
        return this.stem.x1.baseVal.value;
    }
}
