import React from "react";
import { BAND } from "./NewHero";
import { useNearViewport } from "../hooks/useNearViewport";

/**
 * The transition between the hero's sky and the page below it.
 *
 * A band at the head of the page that the hero is seen through: transparent at
 * its top edge, solid white at its bottom. Because it is part of the document
 * rather than an animation, it is exactly as smooth as the browser's own
 * scrolling, it reverses for free, and there is no state that can be wrong.
 *
 * The change from dark to light is carried by cloud rather than by a blend. A
 * straight dark-to-light gradient spends its middle at fifty percent white over
 * black, and that flat grey is what makes such transitions look washed out.
 * Broken up into cloud, the same journey has texture the whole way.
 *
 * Both cloud layers are fractal noise rendered once by the browser as an image.
 * Turbulence is expensive to compute, but nothing animates the filter — only
 * the layer it lands on is moved — so that cost is paid a single time.
 */

// The far mass, and the finer one that drifts across it. Different seeds and
// frequencies, so the two never resolve into one repeating shape.
const CLOUD_FAR =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22700%22%3E%3Cfilter%20id%3D%22c%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.009%200.016%22%20numOctaves%3D%224%22%20seed%3D%227%22%20result%3D%22n%22%2F%3E%3CfeColorMatrix%20in%3D%22n%22%20type%3D%22matrix%22%20values%3D%220%200%200%200%201%200%200%200%200%201%200%200%200%200%201%201%200%200%200%200%22%2F%3E%3CfeGaussianBlur%20stdDeviation%3D%2214%22%2F%3E%3CfeComponentTransfer%3E%3CfeFuncA%20type%3D%22linear%22%20slope%3D%221.5%22%20intercept%3D%22-0.32%22%2F%3E%3C%2FfeComponentTransfer%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23c)%22%2F%3E%3C%2Fsvg%3E";
const CLOUD_NEAR =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22700%22%3E%3Cfilter%20id%3D%22c%22%20x%3D%22-20%25%22%20y%3D%22-20%25%22%20width%3D%22140%25%22%20height%3D%22140%25%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.018%200.03%22%20numOctaves%3D%223%22%20seed%3D%2219%22%20result%3D%22n%22%2F%3E%3CfeColorMatrix%20in%3D%22n%22%20type%3D%22matrix%22%20values%3D%220%200%200%200%201%200%200%200%200%201%200%200%200%200%201%201%200%200%200%200%22%2F%3E%3CfeGaussianBlur%20stdDeviation%3D%228%22%2F%3E%3CfeComponentTransfer%3E%3CfeFuncA%20type%3D%22linear%22%20slope%3D%221.3%22%20intercept%3D%22-0.42%22%2F%3E%3C%2FfeComponentTransfer%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23c)%22%2F%3E%3C%2Fsvg%3E";

// Where the cloud is allowed to show. Nothing at the very top — the sky has to
// be clean as the band arrives — and then a long tail that carries on past the
// point where the background is already white, so the cloud thins out into it
// instead of stopping where the colour does.
const CLOUD_MASK =
  "linear-gradient(to bottom," +
  " transparent 0%," +
  " rgba(0,0,0,0.3) 20%," +
  " #000 42%," +
  " #000 62%," +
  " rgba(0,0,0,0.55) 78%," +
  " rgba(0,0,0,0.22) 90%," +
  " transparent 100%)";

// How far the cloud hangs below the band, as a fraction of it. This is what
// removes the line: the background finishes going white well before the bottom
// edge, and the cloud keeps going past it into the page, white on white, so
// there is no row of pixels where anything changes.
const CLOUD_OVERHANG = 0.55;

// The white underneath. Weighted low — barely there for the first half, then
// resolving quickly, so the band never sits at an even grey — and fully white
// by 84% rather than at the very bottom, leaving a stretch of flat white where
// nothing is changing at all. A gradient that arrives exactly at its own edge
// puts a visible line there, because that edge is the last place the colour
// moves.
const BASE =
  "linear-gradient(to bottom," +
  " rgba(255,255,255,0) 0%," +
  " rgba(233,238,244,0.03) 20%," +
  " rgba(235,240,246,0.09) 34%," +
  " rgba(238,242,247,0.2) 47%," +
  " rgba(242,245,249,0.42) 58%," +
  " rgba(246,249,251,0.7) 69%," +
  " rgba(252,253,254,0.93) 78%," +
  " #FFFFFF 84%," +
  " #FFFFFF 100%)";

const CloudBand: React.FC = () => {
  // Both layers drift forever. Off screen that is two composited surfaces being
  // moved every frame for nothing, on a page where the hero is already drawing
  // a starfield.
  const [ref, near] = useNearViewport<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      // The hero measures its transition off this, rather than counting
      // viewports — see the comment in NewHero's scroll handler.
      data-cloud-band
      className="absolute inset-x-0 pointer-events-none"
      style={{
        // Read from the hero rather than written twice: the band's height and the
        // scroll the hero owns for it are the same measurement, and they drift
        // apart the moment they are two numbers.
        height: `${BAND * 100}vh`,
        top: `${BAND * -100}vh`,
      }}
    >
      <div className="absolute inset-0" style={{ background: BASE }} />

      {/* Drifting sideways at two speeds. Only a transform moves, so both layers
        stay on the compositor and nothing is repainted as they go. */}
      <div
        className={`absolute -inset-x-[18%] top-0 opacity-[0.55] animate-cloudFar motion-reduce:animate-none ${
          near ? "" : "[animation-play-state:paused]"
        }`}
        style={{
          // Hangs below the band, over the top of the page itself.
          bottom: `${BAND * -100 * CLOUD_OVERHANG}vh`,
          backgroundImage: `url("${CLOUD_FAR}")`,
          backgroundSize: "cover",
          maskImage: CLOUD_MASK,
          WebkitMaskImage: CLOUD_MASK,
        }}
      />
      <div
        className={`absolute -inset-x-[18%] top-0 opacity-[0.4] animate-cloudNear motion-reduce:animate-none ${
          near ? "" : "[animation-play-state:paused]"
        }`}
        style={{
          bottom: `${BAND * -100 * CLOUD_OVERHANG}vh`,
          backgroundImage: `url("${CLOUD_NEAR}")`,
          backgroundSize: "cover",
          maskImage: CLOUD_MASK,
          WebkitMaskImage: CLOUD_MASK,
        }}
      />
    </div>
  );
};

export default CloudBand;
