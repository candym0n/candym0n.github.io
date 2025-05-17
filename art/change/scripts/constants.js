const ELEMENTS = {
    PLANTS: "#plants",

    WATERING_CAN: "#wateringCan",
    FERTILIZER: "#fertilizer",
    PARTICLES: "#particles",
    
    WATER_BAR: "#waterBar",
    FERTILIZER_BAR: "#fertilizerBar",

    MOUTH: "#mouth"
}

const ANIMATION = {
    SEGMENT_LENGTH: 20,

    LEAF_GROW_DUR: 0.7,
    LEAF_WITHER_DUR: 1.5,

    STEM_GROW_DUR: 0.7,
    STEM_WITHER_DUR: 0.7,

    FLOWER_GROW_DUR: 0.7,
    FLOEWR_WITHER_DUR: 1.5,

    DRAGGABLE_SNAP_DUR: 0.5,

    DUMPING_INTERVAL: 10
}

const TRANSFORM = {
    SCALE: 2,             // scaleX(2) scaleY(2)
    TRANSLATE_X_VW: 0.45, // 45vw
    TRANSLATE_Y_VH: 1.00, // 100vh
}

const POSITION = {
    HEAD_LEFT: 20,
    HEAD_RIGHT: 130
}

const BAR = {
    WIDTH: 144,
    GROW_RATE: 10, // percent per second
}

// Or really the Y-Coordinate of a control point on the Bezier Curve that is his mouth
const EMOTIONS = {
    FULLY_HAPPY: -40,
    FULLY_SAD: -50
}

const SVG_NS = "http://www.w3.org/2000/svg";

export { ELEMENTS, ANIMATION, TRANSFORM, POSITION, SVG_NS, BAR, EMOTIONS }
