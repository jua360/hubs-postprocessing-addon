import { addComponent, defineQuery, enterQuery, exitQuery } from "bitecs";
import {
  HubsWorld,
  EntityID,
  App,
  getStore,
  PostProcessOrderE,
  registerPass,
  unregisterPass,
  anyEntityWith,
} from "hubs";
import { Outlined, PostProcessingEffects } from "./components";
import { EffectPass, OutlineEffect, BlendFunction } from "postprocessing";
import { POST_PROCESSING_FLAGS } from "./post-processing";

export const outlinedInflator = (world: HubsWorld, eid: number): EntityID => {
  addComponent(world, Outlined, eid);
  return eid;
};

const outlinedQuery = defineQuery([Outlined]);
let outlinePass: EffectPass | null = null;
let outlineEffect: OutlineEffect | null = null;
export function enableOutline(app: App) {
  if (!outlinePass) {
    const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
    outlineEffect = new OutlineEffect(app.world.scene, app.scene.camera, {
      edgeStrength:
        PostProcessingEffects.outlineEdgeStrength[postProcessingEid],
      visibleEdgeColor:
        PostProcessingEffects.outlineVisibleEdgeColor[postProcessingEid],
    });
    outlinedQuery(app.world).forEach((eid: EntityID) => {
      const obj = app.world.eid2obj.get(eid)!;
      if (!outlineEffect!.selection.has(obj)) {
        outlineEffect!.selection.add(obj);
      }
    });
    outlinePass = new EffectPass(app.scene.camera, outlineEffect);
    registerPass(app, outlinePass, PostProcessOrderE.AfterBloom);
  } else {
    outlineEffect!.selection.clear();
    outlinedQuery(app.world).forEach((eid: EntityID) => {
      const obj = app.world.eid2obj.get(eid)!;
      if (!outlineEffect!.selection.has(obj)) {
        outlineEffect!.selection.add(obj);
      }
    });
  }
}

export function disableOutline(app: App) {
  if (outlinePass) {
    outlinePass && unregisterPass(app, outlinePass);
    outlinePass = null;
    outlineEffect = null;
  }
}

const outlinedEnterQuery = enterQuery(outlinedQuery);
const outlinedExitQuery = exitQuery(outlinedQuery);
export function outlineSystem(app: App) {
  const store = getStore();
  if (store.state.preferences.fxOutline) {
    outlinedExitQuery(app.world).forEach((eid) => {
      const obj = app.world.eid2obj.get(eid)!;
      if (outlineEffect) {
        outlineEffect.selection.delete(obj);
      }
    });
    outlinedEnterQuery(app.world).forEach((eid) => {
      const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
      if (postProcessingEid) {
        const flags = PostProcessingEffects.flags[postProcessingEid];
        if (
          store.state.preferences.fxOutline &&
          flags & POST_PROCESSING_FLAGS.OUTLINE &&
          outlineEffect
        ) {
          const obj = app.world.eid2obj.get(eid)!;
          outlineEffect.selection.add(obj);
        }
      }
    });
  }
}
