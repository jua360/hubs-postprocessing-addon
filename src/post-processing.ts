import { addComponent } from "bitecs";
import { HubsWorld, EntityID } from "hubs";
import { PostProcessingEffects } from "./components";
import { Color } from "three";

type PostProcessingParams = {
  glitch?: boolean;
  glitchDelay?: { x: number; y: number };
  glitchDuration?: { x: number; y: number };
  glitchStrength?: { x: number; y: number };
  glitchColumns?: number;
  glitchRatio?: number;
  outline?: boolean;
  outlineEdgeStrength?: number;
  outlineVisibleEdgeColor?: string;
  ssao?: boolean;
  ssaoIntensity?: number;
  ssaoFade?: number;
  ssaoSamples?: number;
  ssaoRings?: number;
  ssaoColor?: string;
  godRays?: boolean;
  godRaysDensity?: number;
  godRaysDecay?: number;
  godRaysWeight?: number;
  godRaysExposure?: number;
  godRaysSamples?: number;
  godRaysClampMax?: number;
  pixelate?: boolean;
  pixelateGranularity?: number;
};

export const enum POST_PROCESSING_FLAGS {
  GLITCH = 1 << 0,
  OUTLINE = 1 << 1,
  SSAO = 1 << 2,
  GOD_RAYS = 1 << 3,
  PIXELATE = 1 << 4,
}

const POST_PROCESSING_DEFAULTS: Partial<PostProcessingParams> = {
  glitch: false,
  glitchDelay: { x: 1.5, y: 3.5 },
  glitchDuration: { x: 0.6, y: 1.0 },
  glitchStrength: { x: 0.3, y: 1.0 },
  glitchColumns: 0.05,
  glitchRatio: 0.15,
  outline: false,
  outlineEdgeStrength: 2.5,
  outlineVisibleEdgeColor: "#FFFFFF",
  ssao: false,
  ssaoIntensity: 1.0,
  ssaoFade: 0.01,
  ssaoSamples: 9,
  ssaoRings: 7,
  ssaoColor: "#000000",
  godRays: false,
  godRaysDensity: 0.96,
  godRaysDecay: 0.92,
  godRaysWeight: 0.3,
  godRaysExposure: 0.54,
  godRaysSamples: 60,
  godRaysClampMax: 1.0,
  pixelate: false,
  pixelateGranularity: 8,
};

const tmpColor = new Color();
export const postProcessingEffectsInflator = (
  world: HubsWorld,
  eid: number,
  params?: PostProcessingParams
): EntityID => {
  const required = Object.assign(
    {},
    POST_PROCESSING_DEFAULTS,
    params
  ) as Required<PostProcessingParams>;
  addComponent(world, PostProcessingEffects, eid);
  if (required.glitch === true) {
    PostProcessingEffects.flags[eid] |= POST_PROCESSING_FLAGS.GLITCH;
    PostProcessingEffects.glitchDelay[eid].set([
      required.glitchDelay.x,
      required.glitchDelay.y,
    ]);
    PostProcessingEffects.glitchDuration[eid].set([
      required.glitchDuration.x,
      required.glitchDuration.y,
    ]);
    PostProcessingEffects.glitchStrength[eid].set([
      required.glitchStrength.x,
      required.glitchStrength.y,
    ]);
    PostProcessingEffects.glitchColumns[eid] = required.glitchColumns;
    PostProcessingEffects.glitchRatio[eid] = required.glitchRatio;
  }
  if (required.outline === true) {
    PostProcessingEffects.flags[eid] |= POST_PROCESSING_FLAGS.OUTLINE;
    PostProcessingEffects.outlineEdgeStrength[eid] =
      required.outlineEdgeStrength;
    PostProcessingEffects.outlineVisibleEdgeColor[eid] = tmpColor
      .set(required.outlineVisibleEdgeColor)
      .getHex();
  }
  if (required.ssao === true) {
    PostProcessingEffects.flags[eid] |= POST_PROCESSING_FLAGS.SSAO;
    PostProcessingEffects.ssaoIntensity[eid] = required.ssaoIntensity;
    PostProcessingEffects.ssaoFade[eid] = required.ssaoFade;
    PostProcessingEffects.ssaoSamples[eid] = required.ssaoSamples;
    PostProcessingEffects.ssaoRings[eid] = required.ssaoRings;
    PostProcessingEffects.ssaoColor[eid] = tmpColor
      .set(required.ssaoColor)
      .getHex();
  }
  if (required.godRays === true) {
    PostProcessingEffects.flags[eid] |= POST_PROCESSING_FLAGS.GOD_RAYS;
    PostProcessingEffects.godRaysClampMax[eid] = required.godRaysClampMax;
    PostProcessingEffects.godRaysDecay[eid] = required.godRaysDecay;
    PostProcessingEffects.godRaysDensity[eid] = required.godRaysDensity;
    PostProcessingEffects.godRaysExposure[eid] = required.godRaysExposure;
    PostProcessingEffects.godRaysSamples[eid] = required.godRaysSamples;
    PostProcessingEffects.godRaysWeight[eid] = required.godRaysWeight;
  }
  if (required.pixelate === true) {
    PostProcessingEffects.flags[eid] |= POST_PROCESSING_FLAGS.PIXELATE;
    PostProcessingEffects.pixelateGranularity[eid] =
      required.pixelateGranularity;
  }
  return eid;
};
