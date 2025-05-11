import Plant from "./plants/Plant.js";
import Flowers from "./flowers.js";
import { ELEMENTS } from "./constants.js";

function main() {
    /**
     * The sunflower symbolizes loyalty.
     * It always points towards the sun.
     */
    const sunflowerShape = Flowers.createSunflower({
        radius: 30,
        centerRadius: 15,
        numPetals: 20
    });

    const sunflower = new Plant(50, -100, sunflowerShape, 0, 10);

    /**
     * The peony symbolizes prosperity, wealth and honor.
     * It is full of lush, full blooms.
     */
    const peonyShape = Flowers.createPeony({
        radius: 15
    });

    const peony = new Plant(25, -100, peonyShape, 0.1, 11);

    /**
     * The rose symbolizes love
     * It is associated with the god of love in Greek mythology.
     */
    const roseShape = Flowers.createRose({
        radius: 13
    });

    const rose = new Plant(75, -100, roseShape, -0.08, 10);

    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if (key == "g") {
            let x = peony.GrowPlant();
            x &= rose.GrowPlant();
            x &= sunflower.GrowPlant();
            if (x)
                gsap.to(ELEMENTS.HAPPY_TEXT, {
                    opacity: 1,
                    duration: 1
                });
        } else if (key == "w") {
            peony.WitherPlant();
            sunflower.WitherPlant();
            rose.WitherPlant();
            gsap.to(ELEMENTS.HAPPY_TEXT, {
                opacity: 0,
                duration: 1
            });
        }
    });
}

main();
