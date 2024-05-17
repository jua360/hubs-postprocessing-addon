import {
  PixelationEffect,
  SSAOEffect,
  NormalPass,
  EffectPass,
  BlendFunction,
  DepthDownsamplingPass,
} from "postprocessing";
import { ADDON_ID } from "./consts";
import {
  App,
  PREFERENCE_LIST_ITEM_TYPE,
  PostProcessOrderE,
  getStore,
  registerAddon,
  registerPass,
  unregisterPass,
} from "hubs";

let pixelationPass: EffectPass | null = null;
let pixelationEffect: PixelationEffect | null = null;
function enablePixelation(app: App) {
  if (!pixelationPass) {
    pixelationEffect = new PixelationEffect(
      app.store.state.preferences.fxPixelationLevel
    );
    pixelationPass = new EffectPass(app.scene.camera, pixelationEffect);
    registerPass(app, pixelationPass, PostProcessOrderE.AfterBloom);
  }
}

function disablePixelation(app: App) {
  if (pixelationPass) {
    pixelationPass && unregisterPass(app, pixelationPass);
    pixelationPass = null;
    pixelationEffect = null;
  }
}

let ssaoPass: EffectPass | null = null;
let ssaoEffect: SSAOEffect | null = null;
function enableSSAO(app: App) {
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
    ssaoEffect = new SSAOEffect(app.scene.camera, normalPass.texture, {
      blendFunction: BlendFunction.MULTIPLY,
      worldDistanceThreshold: 20,
      worldDistanceFalloff: 5,
      worldProximityThreshold: 0.4,
      worldProximityFalloff: 0.1,
      luminanceInfluence: 0.7,
      samples: 16,
      rings: 7,
      radius: app.store.state.preferences.ssao_radius,
      intensity: app.store.state.preferences.ssao_intensity,
      bias: 0.025,
      fade: 0.01,
      resolutionScale: 0.5,
      normalDepthBuffer,
      distanceScaling: true,
      depthAwareUpsampling: true,
      distanceThreshold: 0.02, // Render up to a distance of ~20 world units
      distanceFalloff: 0.0025, // with an additional ~2.5 units of falloff.
      rangeThreshold: 0.0003, // Occlusion proximity of ~0.3 world units
      rangeFalloff: 0.0001, // with ~0.1 units of falloff.
      minRadiusScale: 0.33,
    });
    ssaoPass = new EffectPass(app.scene.camera, ssaoEffect);
    registerPass(app, ssaoPass, PostProcessOrderE.AfterBloom);
  }
}

function disableSSAO(app: App) {
  if (ssaoPass) {
    ssaoPass && unregisterPass(app, ssaoPass);
    ssaoPass = null;
    ssaoEffect = null;
  }
}

function onReady(app: App, config?: JSON) {
  const store = getStore();
  if (store.state.preferences.fxPixelation) {
    enablePixelation(app);
  }
  if (store.state.preferences.fxSSAO) {
    enableSSAO(app);
  }
  store.addEventListener("statechanged", () => {
    if (store.state.preferences.fxPixelation) {
      if (!pixelationPass) {
        enablePixelation(app);
      } else {
        pixelationEffect &&
          (pixelationEffect.granularity =
            store.state.preferences.fxPixelationLevel);
      }
    } else {
      disablePixelation(app);
    }
    if (store.state.preferences.fxSSAO) {
      if (!ssaoPass) {
        enableSSAO(app);
      } else {
        ssaoEffect &&
          (ssaoEffect.radius = store.state.preferences.fxSSAORadius);
      }
    } else {
      disableSSAO(app);
    }
  });
}

registerAddon(ADDON_ID, {
  name: "Post-Processing",
  description: "This add-on adds ThreeJS post-processing effects to Hubs",
  onReady,
  preference: [
    {
      fxPixelation: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "Pixelation effect",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
        },
      },
      fxPixelationLevel: {
        prefDefinition: { type: "number", default: 8 },
        prefConfig: {
          description: "Pixelation level",
          prefType: PREFERENCE_LIST_ITEM_TYPE.NUMBER_WITH_RANGE,
          min: 0,
          max: 32,
          step: 2,
          digits: 0,
        },
      },
      fxSSAO: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "SSAO (Screen Space Ambient Occlusion)",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
        },
      },
      fxSSAORadius: {
        prefDefinition: { type: "number", default: 0.1 },
        prefConfig: {
          description: "Radius",
          prefType: PREFERENCE_LIST_ITEM_TYPE.NUMBER_WITH_RANGE,
          min: 0,
          max: 4,
          step: 0.1,
          digits: 1,
        },
      },
      fxSSAOIntensity: {
        prefDefinition: { type: "number", default: 1 },
        prefConfig: {
          description: "Intensity",
          prefType: PREFERENCE_LIST_ITEM_TYPE.NUMBER_WITH_RANGE,
          min: 0,
          max: 10,
          step: 0.1,
          digits: 1,
        },
      },
    },
  ],
});
