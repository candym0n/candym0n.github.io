import Draggable from "./Draggable.js";
import Particles from "../Particles.js";
import Bar from "../Bar.js";
import { ANIMATION, BAR, POSITION } from "../constants.js";

export default class Dumper extends Draggable {
    dumping; /** @private {boolean} Whether or not the dumper is dumping */

    /**
     * @param {number} x
     * @param {number} y
     * @param {string} color The color of the particles that are dumped out
     * @param {string} selector
     * @param {Bar} bar
     */
    constructor(x, y, color, selector, bar) {
        super(x, y, document.querySelector(selector));

        setInterval(() => {
            const xCoord = gsap.getProperty(this.element, "x");
            const yCoord = gsap.getProperty(this.element, "y");

            if (this.dumping) {
                Particles.NewParticle(xCoord - 24, yCoord, color);
                bar.barValue += ANIMATION.DUMPING_INTERVAL / 1000 * BAR.GROW_RATE;
            }
        }, ANIMATION.DUMPING_INTERVAL);
    }

    onDrag(xCoord, _yCoord) {
        // Check if the dumper is within the dumping radius
        if (xCoord >= POSITION.HEAD_LEFT && xCoord <= POSITION.HEAD_RIGHT) {
            if (!this.dumping) {
                this.dumping = true;
                gsap.to(this.element, {
                    rotation: -45,
                    duration: 0.1
                });
            }
        } else if (this.dumping) {
            this.dumping = false;
            gsap.killTweensOf(this.element);
            gsap.to(this.element, {
                rotation: 0,
                duration: 0.1
            });
        }
    }

    onUnDrag() {
        this.dumping = false;
    }
}
