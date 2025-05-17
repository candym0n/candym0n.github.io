import { ELEMENTS, SVG_NS } from "./constants.js";

export default class Particles {
    static NewParticle(x, y, color) {
        const particle = document.createElementNS(SVG_NS, "circle");
        particle.setAttribute("cx", 0);
        particle.setAttribute("cy", 0);
        particle.setAttribute("r", 2 + Math.random());
        particle.setAttribute("stroke", "none");
        particle.setAttribute("fill", color);

        document.querySelector(ELEMENTS.PARTICLES).appendChild(particle);

        gsap.set(particle, {
            x, y,
            opacity: Math.random() * 0.5 + 0.5
        });

        gsap.to(particle, {
            x: "+=" + (Math.random() - 0.5) * 100,
            y: 0,
            opacity: 0,
            duration: 1,
            onComplete: () => particle.remove()
        });
    }
}
