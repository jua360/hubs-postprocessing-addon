import {
  App,
  registerPass,
  PostProcessOrderE,
  unregisterPass,
  anyEntityWith,
} from "hubs";
import {
  EffectPass,
  SSAOEffect,
  NormalPass,
  DepthDownsamplingPass,
  BlendFunction,
} from "postprocessing";
import { PostProcessingEffects } from "./components";
import { Color } from "three";

let ssaoPass: EffectPass | null = null;
let ssaoEffect: SSAOEffect | null = null;
export function enableSSAO(app: App) {
  if (!ssaoPass) {
    const normalPass = new NormalPass(app.scene, app.scene.camera);
    const depthDownsamplingPass = new DepthDownsamplingPass({
      normalBuffer: normalPass.texture,
      resolutionScale: 0.5,
    });
    const capabilities = app.fx.composer?.getRenderer().capabilities!;
    const normalDepthBuffer = capabilities.isWebGL2
      ? depthDownsamplingPass.texture
      : undefined;
    const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
    ssaoEffect = new SSAOEffect(app.scene.camera, normalPass.texture, {
      blendFunction: BlendFunction.MULTIPLY,
      worldDistanceThreshold: 20,
      worldDistanceFalloff: 5,
      worldProximityThreshold: 0.4,
      worldProximityFalloff: 0.1,
      normalDepthBuffer,
      intensity: PostProcessingEffects.ssaoIntensity[postProcessingEid],
      fade: PostProcessingEffects.ssaoFade[postProcessingEid],
      samples: PostProcessingEffects.ssaoSamples[postProcessingEid],
      rings: PostProcessingEffects.ssaoRings[postProcessingEid],
      color: new Color(PostProcessingEffects.ssaoColor[postProcessingEid]),
    });
    ssaoPass = new EffectPass(app.scene.camera, ssaoEffect);
    registerPass(app, ssaoPass, PostProcessOrderE.AfterBloom);
  }
}

export function disableSSAO(app: App) {
  if (ssaoPass) {
    ssaoPass && unregisterPass(app, ssaoPass);
    ssaoPass = null;
    ssaoEffect = null;
  }
}
