import Plant from "./plants/Plant.js";
import Flowers from "./plants/flowers.js";
import UI from "./interact/UI.js";
import { ELEMENTS } from "./constants.js";
import Bar from "./Bar.js";
import Dumper from "./interact/Dumper.js";
import Garden from "./Garden.js";

let peony, rose, sunflower;

function grow() {
    peony.GrowPlant();
    rose.GrowPlant();
    sunflower.GrowPlant();
}

function wither() {
    peony.WitherPlant();
    sunflower.WitherPlant();
    rose.WitherPlant();
}

function setupFlowers() {
    /**
     * The sunflower symbolizes loyalty.
     * It always points towards the sun.
     */
    const sunflowerShape = Flowers.createSunflower({
        radius: 30,
        centerRadius: 15,
        numPetals: 20
    });

    sunflower = new Plant(50, -100, sunflowerShape, 0, 10);

    /**
     * The peony symbolizes prosperity, wealth and honor.
     * It is full of lush, full blooms.
     */
    const peonyShape = Flowers.createPeony({
        radius: 15
    });

    peony = new Plant(25, -100, peonyShape, 0.1, 11);

    /**
     * The rose symbolizes love
     * It is associated with the god of love in Greek mythology.
     */
    const roseShape = Flowers.createRose({
        radius: 13
    });

    rose = new Plant(75, -100, roseShape, -0.08, 10);
}

function main() {
    UI.Init();
    
    setupFlowers();

    // Setup bars
    const waterBar = new Bar(document.querySelector(ELEMENTS.WATER_BAR), 50, "green", "red");
    const fertilizerBar = new Bar(document.querySelector(ELEMENTS.FERTILIZER_BAR), 50, "green", "red");

    // Setup the tools
    const wateringCan = new Dumper(250, -125, "blue", ELEMENTS.WATERING_CAN, waterBar);
    const fertilizer = new Dumper(250, -50, "#99612C", ELEMENTS.FERTILIZER, fertilizerBar);

    // Setup the garden
    const garden = new Garden(
        [rose, peony, sunflower],
        [waterBar, fertilizerBar]
    );
}

main();