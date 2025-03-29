/**
 * Interactive UI elements handler
 * @module InteractiveElements
 */
import { INFO_TEXT_ID, INTERACT_BUTTON_ID } from '../core/constants.js';
import { Canvas } from '../components/Canvas.js';
import { Particle } from '../components/Particle.js';

/**
 * InteractiveElements class handles interactive UI elements like clicking the canvas
 */
export class InteractiveElements {
    changedInfoText = false;

    /**
     * Create a new InteractiveElements instance
     */
    constructor(canvasInstance) {
        this.canvasInstance = canvasInstance;
        this._initEventListeners();
    }

    /**
     * Initialize interactive elements
     * @private
     */
    _initEventListeners() {
        // Check for clicking on the canvas
        window.addEventListener("click", ((e) => {
            let infoText = document.getElementById(INFO_TEXT_ID);
            const sleep = async ms => new Promise(res => setTimeout(res, ms));
            (async function () {
                let length = infoText.textContent.length;
                if (!this.changedInfoText) {
                    for (let i = 0; i < length; ++i) {
                        await sleep(1);
                        infoText.textContent = infoText.textContent.substring(0, infoText.textContent.length - 1);
                    }
                    this.changedInfoText = true;
                    await sleep(100);
                    let newText = "Each dot represents an idea. Clicking on the canvas will join them together to create an artwork. Click again to make them seperate.";
                    for (let i = 0; i < newText.length; ++i) {
                        await sleep(1);
                        infoText.textContent += newText[i];
                    }
                }
            }).bind(this)();

            if (this.canvasInstance.animatingClump)
                return void this.canvasInstance.finishParticleClumps(e);

            this.canvasInstance.animateParticleClumps(e);
        }).bind(this));
    }
}
