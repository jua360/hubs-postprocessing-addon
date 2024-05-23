import { Types, defineComponent } from "bitecs";

export const PostProcessingEffects = defineComponent({
  flags: Types.i8,
  glitchDelay: [Types.f32, 2],
  glitchDuration: [Types.f32, 2],
  glitchStrength: [Types.f32, 2],
  glitchColumns: Types.f32,
  glitchRatio: Types.f32,
  outlineEdgeStrength: Types.f32,
  outlineVisibleEdgeColor: Types.ui32,
  ssaoIntensity: Types.f32,
  ssaoFade: Types.f32,
  ssaoSamples: Types.ui8,
  ssaoRings: Types.ui8,
  ssaoColor: Types.ui32,
  godRaysDensity: Types.f32,
  godRaysDecay: Types.f32,
  godRaysWeight: Types.f32,
  godRaysExposure: Types.f32,
  godRaysSamples: Types.ui8,
  godRaysClampMax: Types.f32,
  pixelateGranularity: Types.ui8,
});
export const Outlined = defineComponent();
export const GodRays = defineComponent();
