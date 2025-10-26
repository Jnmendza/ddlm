"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function killScrollAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => {
    try {
      trigger.kill(true);
    } catch {
      // ignore errors when the DOM node has already been removed
    }
  });
  gsap.globalTimeline.getChildren().forEach((child) => child.kill());
  ScrollTrigger.clearMatchMedia();
}
