import {
  App,
  registerPass,
  PostProcessOrderE,
  unregisterPass,
  anyEntityWith,
} from "hubs";
import {
  EffectPass,
  GlitchEffect,
  NoiseEffect,
  ChromaticAberrationEffect,
  BlendFunction,
} from "postprocessing";
import { DataTexture, Vector2 } from "three";
import perturb from "../assets/perturb.jpg";
import { PostProcessingEffects } from "./components";

let perturbTex = new DataTexture(perturb, 512, 512);
let glitchPass: EffectPass | null = null;
let glitchEffect: GlitchEffect | null = null;
let noiseEffect: NoiseEffect | null = null;
let chromaticAberrationPass: EffectPass | null = null;
let chromaticAberrationEffect: ChromaticAberrationEffect | null;
export function enableGlitch(app: App) {
  if (!chromaticAberrationPass && !glitchPass) {
    chromaticAberrationEffect = new ChromaticAberrationEffect();
    chromaticAberrationPass = new EffectPass(
      app.scene.camera,
      chromaticAberrationEffect
    );
    registerPass(app, chromaticAberrationPass, PostProcessOrderE.AfterAA);

    const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
    glitchEffect = new GlitchEffect({
      perturbationMap: perturbTex,
      chromaticAberrationOffset: chromaticAberrationEffect.offset,
      delay: new Vector2().fromArray(
        PostProcessingEffects.glitchDelay[postProcessingEid]
      ),
      duration: new Vector2().fromArray(
        PostProcessingEffects.glitchDuration[postProcessingEid]
      ),
      strength: new Vector2().fromArray(
        PostProcessingEffects.glitchStrength[postProcessingEid]
      ),
      columns: PostProcessingEffects.glitchColumns[postProcessingEid],
      ratio: PostProcessingEffects.glitchRatio[postProcessingEid],
    });
    noiseEffect = new NoiseEffect({
      blendFunction: BlendFunction.COLOR_DODGE,
    });

    noiseEffect.blendMode.opacity.value = 0.1;
    glitchPass = new EffectPass(app.scene.camera, glitchEffect, noiseEffect);
    registerPass(app, glitchPass, PostProcessOrderE.AfterAA);
  }
}

export function disableGlitch(app: App) {
  if (glitchPass && chromaticAberrationPass) {
    glitchPass && unregisterPass(app, glitchPass);
    glitchPass = null;
    glitchEffect = null;

    chromaticAberrationPass && unregisterPass(app, chromaticAberrationPass);
    chromaticAberrationPass = null;
    chromaticAberrationEffect = null;
  }
}
