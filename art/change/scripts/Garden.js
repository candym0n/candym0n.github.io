import { BAR, ELEMENTS, EMOTIONS } from "./constants.js";

export default class Garden {
    mouth;  /** The mouth of the garden (not everyday vocabulary) */

    plants; /** @private {Plant[]} A list of plants in the garden */
    bars;   /** @private {Bar[]}   A list of bars to be kept in check */

    constructor(plants, bars) {
        // Set instance properties
        this.plants = plants;
        this.bars = bars;
        this.mouth = document.querySelector(ELEMENTS.MOUTH);

        // Set the growing interval
        setInterval((() => {
            if (this.balanced) {
                this.randomPlant?.GrowPlant();
            } else {
                this.randomGrownPlant?.WitherPlant();
            }
        }).bind(this), 1000);

        // Gradually consume resources and update smile
        setInterval((() => {
            this.bars.forEach(a => a.barValue -= BAR.GROW_RATE / 1000);
            this.emotion = this.plants.reduce((accum, curr) => accum + curr.GrownPercentage, 0) / 3;
        }).bind(this), 1);
    }

    get balanced() {
        for (let bar of this.bars) {
            if (!bar.balanced) return false;
        }

        return true;
    }

    get randomPlant() {
        return this.plants[Math.floor(Math.random() * this.plants.length)];
    }

    get randomGrownPlant() {
        for (let i = 0; i < this.plants.length; ++i) {
            if (Math.random() > 0.5) continue;
            if (this.plants[i].NoPlant) continue;

            return this.plants[i];
        }
    }

    set emotion(percent) {
        this.mouth.setAttribute("d",
            "M 40 -45 Q 50 " +
            gsap.utils.interpolate(EMOTIONS.FULLY_SAD, EMOTIONS.FULLY_HAPPY, percent) +
            " 60 -45"
        );
    }
}
