import { BAR, ELEMENTS, SVG_NS } from "./constants.js";

export default class Bar {
    barElement;   /** @private The <rect> that changes sizes*/
    
    value; /** @private {number} The current value of the bar (0 - 100) */

    avgColor /** @private The color of the bar when the balance is perfect */
    badColor /** @private The color of the bar when the balance is off */

    /**
     * @param bar      The inner element of the bar 
     * @param avgColor The average color [40, 60]
     * @param badColor The bad color [0, 40) U (60, 100]
     * 
     * @note Too much or too little is bad, just enough is the only good
     */
    constructor(bar, initialValue, avgColor, badColor) {
        // Set instance properties
        this.barElement = bar;
        this.avgColor = avgColor;
        this.badColor = badColor;

        // Set the initial value of the bar
        this.barValue = initialValue;
    }

    /**
     * @param {number} value
     */
    set barValue(value) {
        if (value >= 100)
            return void (this.value = 100);

        if (value <= 0)
            return void (this.value = 0);

        this.value = value;

        if (this.balanced) 
            gsap.to(this.barElement, {
                fill: this.avgColor,
                width: BAR.WIDTH * value / 100,
                duration: 1
            });
        else
            gsap.to(this.barElement, {
                fill: this.badColor,
                width: BAR.WIDTH * value / 100,
                duration: 1
            });
    }

    get barValue() {
        return this.value;
    }

    /**
     * Whether or not the bar value is good or not
     * @returns {boolean}
     */
    get balanced() {
        return this.value >= 40 && this.value <= 60;
    }
}
