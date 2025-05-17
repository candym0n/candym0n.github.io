import UI from "./UI.js";
import { ANIMATION, TRANSFORM } from "../constants.js";

export default class Draggable {
    element;    /** @private The element that can be dragged around */
    initialX;   /** @private The initial X-Coordinate of the object */
    initialY;   /** @private The initial Y-coordinate of the object */
    pickedUp;   /** @private {boolean} Whether or not the item is selected */

    /**
     * Called whenever the item is being dragged
     *
     * @param {number} xCoord - The current X-Coordinate of the object
     * @param {number} yCoord - The current Y-Coordinate of the object
     */ 
    onDrag(xCoord, yCoord) {
        
    }

    /**
     * Called whenever the item is not being dragged anymore
     */
    onUnDrag() {

    }

    constructor(x, y, element) {
        this.element = element;

        // Set the initial position of the draggable element
        gsap.set(element, { x, y, transformOrigin: "center" });
        this.initialX = x;
        this.initialY = y;

        // Register callbacks
        UI.RegisterCallback(UI.DOWN | UI.DRAG, (xCoord, yCoord, event) => {
            // Helper functions for calculating vw and vh values
            const vw = x => x * window.innerWidth;
            const vh = y => y * window.innerHeight;

            // Calculate relative positions by inversing the CSS transform
            const relativeX = (xCoord - vw(TRANSFORM.TRANSLATE_X_VW)) / TRANSFORM.SCALE;
            const relativeY = (yCoord - vh(TRANSFORM.TRANSLATE_Y_VH)) / TRANSFORM.SCALE;

            // Determine whether or not the cursor is within the object
            const dx = relativeX - gsap.getProperty(this.element, "x");
            const dy = relativeY - gsap.getProperty(this.element, "y");

            if (!this.pickedUp && dx * dx + dy * dy >= 20 * 20)
                return;

            if (!this.pickedUp && event == UI.DRAG)
                return;

            this.pickedUp = true;

            this.onDrag(relativeX, relativeY);

            gsap.to(this.element, {
                x: relativeX,
                y: relativeY,
                duration: 0.1
            });
        }, this);

        UI.RegisterCallback(UI.UP, (_xCoord, _yCoord, _event) => {
            this.pickedUp = false;

            gsap.to(element, {
                x: this.initialX,
                y: this.initialY,
                duration: ANIMATION.DRAGGABLE_SNAP_DUR,
                rotation: 0
            });

            this.onUnDrag();
        }, this);
    }
}
