import { addComponent } from "bitecs";
import {
  HubsWorld,
  EntityID,
  App,
  PostProcessOrderE,
  anyEntityWith,
  registerPass,
  unregisterPass,
} from "hubs";
import { GodRays, PostProcessingEffects } from "./components";
import {
  BlendFunction,
  EffectPass,
  GodRaysEffect,
  KernelSize,
} from "postprocessing";
import { Mesh } from "three";

let godRaysPass: EffectPass | null = null;
let godRaysEffect: GodRaysEffect | null = null;
export function enableGodRays(app: App) {
  if (!godRaysPass) {
    const sunEid = anyEntityWith(app.world, GodRays);
    const sun = app.world.eid2obj.get(sunEid);
    if (sun && (sun as any).isMesh) {
      sun.removeFromParent();
      const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
      godRaysEffect = new GodRaysEffect(app.scene.camera, sun as Mesh, {
        density: PostProcessingEffects.godRaysDensity[postProcessingEid],
        decay: PostProcessingEffects.godRaysDecay[postProcessingEid],
        weight: PostProcessingEffects.godRaysWeight[postProcessingEid],
        exposure: PostProcessingEffects.godRaysExposure[postProcessingEid],
        clampMax: PostProcessingEffects.godRaysClampMax[postProcessingEid],
        height: 480,
        kernelSize: KernelSize.SMALL,
        samples: PostProcessingEffects.godRaysSamples[postProcessingEid],
        blendFunction: BlendFunction.SCREEN,
      });
      godRaysPass = new EffectPass(app.scene.camera, godRaysEffect);
      registerPass(app, godRaysPass, PostProcessOrderE.AfterScene);
    }
  }
}

export function disableGodRays(app: App) {
  if (godRaysPass) {
    godRaysPass && unregisterPass(app, godRaysPass);
    godRaysPass = null;
    godRaysEffect = null;
  }
}

export const godRaysInflator = (world: HubsWorld, eid: number): EntityID => {
  addComponent(world, GodRays, eid);
  return eid;
};
