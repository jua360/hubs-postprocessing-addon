import {
  App,
  registerPass,
  PostProcessOrderE,
  unregisterPass,
  anyEntityWith,
} from "hubs";
import { EffectPass, PixelationEffect } from "postprocessing";
import { PostProcessingEffects } from "./components";

let pixelationPass: EffectPass | null = null;
let pixelationEffect: PixelationEffect | null = null;
export function enablePixelation(app: App) {
  if (!pixelationPass) {
    const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
    pixelationEffect = new PixelationEffect(
      PostProcessingEffects.pixelateGranularity[postProcessingEid]
    );
    pixelationPass = new EffectPass(app.scene.camera, pixelationEffect);
    registerPass(app, pixelationPass, PostProcessOrderE.AfterAA);
  }
}

export function disablePixelation(app: App) {
  if (pixelationPass) {
    pixelationPass && unregisterPass(app, pixelationPass);
    pixelationPass = null;
    pixelationEffect = null;
  }
}
