import { ADDON_ID } from "./consts";
import {
  App,
  EnvironmentSettings,
  PREFERENCE_LIST_ITEM_TYPE,
  SceneLoader,
  SystemOrderE,
  anyEntityWith,
  getStore,
  registerAddon,
} from "hubs";
import { defineQuery, enterQuery, exitQuery } from "bitecs";
import { PostProcessingEffects } from "./components";
import {
  POST_PROCESSING_FLAGS,
  postProcessingEffectsInflator,
} from "./post-processing";
import {
  disableOutline,
  enableOutline,
  outlineSystem,
  outlinedInflator,
} from "./outline";
import { disableGodRays, enableGodRays, godRaysInflator } from "./god-rays";
import { disablePixelation, enablePixelation } from "./pixelation";
import { disableGlitch, enableGlitch } from "./glitch";
import { disableSSAO, enableSSAO } from "./ssao";

function setupEffects(app: App) {
  const store = getStore();
  const envSettingsEid = anyEntityWith(app.world, EnvironmentSettings);
  const envSettings = EnvironmentSettings.map.get(envSettingsEid);
  const postProcessingEid = anyEntityWith(app.world, PostProcessingEffects);
  if (
    !envSettings?.enableHDRPipeline ||
    !store.state.preferences.enablePostEffects ||
    !postProcessingEid
  ) {
    disableAll(app);
  } else {
    const flags = PostProcessingEffects.flags[postProcessingEid];
    if (flags & POST_PROCESSING_FLAGS.SSAO && store.state.preferences.fxSSAO) {
      enableSSAO(app);
    } else {
      disableSSAO(app);
    }
    if (
      flags & POST_PROCESSING_FLAGS.GOD_RAYS &&
      store.state.preferences.fxGodRays
    ) {
      enableGodRays(app);
    } else {
      disableGodRays(app);
    }
    if (
      flags & POST_PROCESSING_FLAGS.OUTLINE &&
      store.state.preferences.fxOutline
    ) {
      enableOutline(app);
    } else {
      disableOutline(app);
    }
    if (
      flags & POST_PROCESSING_FLAGS.PIXELATE &&
      store.state.preferences.fxPixelation
    ) {
      enablePixelation(app);
    } else {
      disablePixelation(app);
    }
    if (
      flags & POST_PROCESSING_FLAGS.GLITCH &&
      store.state.preferences.fxGlitch
    ) {
      enableGlitch(app);
    } else {
      disableGlitch(app);
    }
  }
}

function disableAll(app: App) {
  disableSSAO(app);
  disableGodRays(app);
  disableOutline(app);
  disablePixelation(app);
  disableGlitch(app);
}

function onReady(app: App, config?: JSON) {
  const store = getStore();
  store.addEventListener("statechanged", () => setupEffects(app));
}

const sceneLoaderQuery = defineQuery([SceneLoader]);
const sceneLoaderEnterQuery = enterQuery(sceneLoaderQuery);
const sceneLoaderExitQuery = exitQuery(sceneLoaderQuery);
function postProcessingEffectsSystem(app: App) {
  sceneLoaderEnterQuery(app.world).forEach(() => disableAll(app));
  sceneLoaderExitQuery(app.world).forEach(() => setupEffects(app));
}

registerAddon(ADDON_ID, {
  name: "Post-Processing",
  description: "This add-on adds ThreeJS post-processing effects to Hubs",
  onReady,
  system: [
    {
      system: postProcessingEffectsSystem,
      order: SystemOrderE.BeforeMatricesUpdate,
    },
    {
      system: outlineSystem,
      order: SystemOrderE.BeforeMatricesUpdate,
    },
  ],
  inflator: [
    {
      gltf: {
        id: "postProcessingEffects",
        inflator: postProcessingEffectsInflator,
      },
    },
    { gltf: { id: "godRays", inflator: godRaysInflator } },
    { gltf: { id: "outlined", inflator: outlinedInflator } },
  ],
  preference: [
    {
      fxPixelation: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "Pixelation effect",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
          disableIfFalse: "enablePostEffects",
        },
      },
      fxSSAO: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "SSAO (Screen Space Ambient Occlusion)",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
          disableIfFalse: "enablePostEffects",
        },
      },
      fxOutline: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "Outlined",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
          disableIfFalse: "enablePostEffects",
        },
      },
      fxGlitch: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "Glitch",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
          disableIfFalse: "enablePostEffects",
        },
      },
      fxGodRays: {
        prefDefinition: { type: "bool", default: false },
        prefConfig: {
          description: "God Rays",
          prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX,
          disableIfFalse: "enablePostEffects",
        },
      },
    },
  ],
});
