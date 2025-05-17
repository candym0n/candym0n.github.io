export default class UI {
    static mouseDownCallbacks; /** @private A list of callbacks to be called when the mouse is pressed */
    static mouseUpCallbacks;   /** @private A list of callbacks to be called when the mouse is released */
    static mouseMoveCallbacks; /** @private A list of callbacks to be called when the mouse is moved */
    static mouseDragCallbacks; /** @private A list of callbacks to be called when the mouse is down and moved */

    static DOWN = 1; /** Enum for mousedown */
    static UP = 2;   /** Enum for mouseup */
    static MOVE = 4; /** Enum for mousemove */
    static DRAG = 8; /** Enum for when the mouse is dragged */

    static mouseDown = false; /** @private Whether or not the mouse is down */

    static Init() {
        // Initialize callbacks to empty arrays
        this.mouseDownCallbacks = [];
        this.mouseUpCallbacks = [];
        this.mouseMoveCallbacks = [];
        this.mouseDragCallbacks = [];

        // Add event listeners
        document.addEventListener("mousedown", (({clientX, clientY}) => {
            this.mouseDown = true;
            this.mouseDownCallbacks.forEach(a=>a(clientX, clientY, this.DOWN));
        }).bind(this));

        document.addEventListener("mouseup", (({clientX, clientY}) => {
            this.mouseDown = false;
            this.mouseUpCallbacks.forEach(a=>a(clientX, clientY, this.UP));
        }).bind(this));

        document.addEventListener("mousemove", (({clientX, clientY}) => {
            this.mouseMoveCallbacks.forEach(a=>a(clientX, clientY, this.MOVE));

            if (this.mouseDown)
                this.mouseDragCallbacks.forEach(a=>a(clientX, clientY, this.DRAG));
        }).bind(this));
    }

    /**
     * Register a callback to one of the events
     * @param {number} event - The events to listen to (binary or to use multiple events like UI.DOWN | UI.DRAG)
     * @param {(number x, number y, number event) => void} callback - The callback to be called
     * @param {any} bind - The object to bind to
     */
    static RegisterCallback(event, callback, bind) {
            if (event & this.UP)
                this.mouseUpCallbacks.push(callback.bind(bind));
            if (event & this.DOWN)
                this.mouseDownCallbacks.push(callback.bind(bind));
            if(event & this.MOVE)
                this.mouseMoveCallbacks.push(callback.bind(bind));
            if (event & this.DRAG)
                this.mouseDragCallbacks.push(callback.bind(bind));
    }
}
