from bpy.props import BoolProperty, FloatProperty, FloatVectorProperty, IntProperty
from io_hubs_addon.components.hubs_component import HubsComponent
from io_hubs_addon.components.types import Category, PanelType, NodeType


class PostProcessingEffects(HubsComponent):
    _definition = {
        'name': 'post-processing-effects',
        'display_name': 'Extra post-processing effects',
        'category': Category.USER,
        'node_type': NodeType.SCENE,
        'panel_type': [PanelType.SCENE],
        'icon': 'SHADERFX',
        'deps': ['environment-settings'],
        'version': (1, 0, 0)
    }

    glitch: BoolProperty(
        name="Glitch",
        description="Glitch post-processing effect",
        default=False)

    glitchDelay: FloatVectorProperty(name="Delay",
                                     description="The minimum and maximum delay between glitch activations in seconds",
                                     size=2,
                                     unit="NONE",
                                     subtype="XYZ",
                                     default=[1.5, 3.5])

    glitchDuration: FloatVectorProperty(name="Duration",
                                        description="The minimum and maximum duration of a glitch in seconds",
                                        size=2,
                                        unit="NONE",
                                        subtype="XYZ",
                                        default=[0.6, 1.0])

    glitchStrength: FloatVectorProperty(name="Strength",
                                        description="The strength of weak and strong glitches",
                                        size=2,
                                        unit="NONE",
                                        subtype="XYZ",
                                        default=[0.3, 1.0])

    glitchColumns: FloatProperty(name="Columns",
                                 description="The scale of the blocky glitch columns",
                                 default=0.05)

    glitchRatio: FloatProperty(name="Ratio",
                               description="The threshold for strong glitches",
                               default=0.15)

    outline: BoolProperty(
        name="Outline",
        description="Outline post-processing effect",
        default=False)

    outlineEdgeStrength: FloatProperty(name="Edge strength",
                                       description="The edge strength",
                                       default=2.5)

    outlineVisibleEdgeColor: FloatVectorProperty(name="Color",
                                                 description="The color of visible edges",
                                                 subtype='COLOR_GAMMA',
                                                 default=(1.0, 1.0, 1.0, 1.0),
                                                 size=4,
                                                 min=0,
                                                 max=1)

    ssao: BoolProperty(
        name="SSAO",
        description="SSAO post-processing effect",
        default=False)

    ssaoIntensity: FloatProperty(name="Intensity",
                                 description="The intensity of the ambient occlusion",
                                 default=1.0)

    ssaoFade: FloatProperty(name="Fade",
                            description="Influences the smoothness of the shadows. A lower value results in higher contrast",
                            default=0.01)

    ssaoSamples: IntProperty(name="Samples",
                             description="The amount of samples per pixel. Should not be a multiple of the ring count",
                             default=9)

    ssaoRings: IntProperty(name="Rings",
                           description="The amount of spiral turns in the occlusion sampling pattern. Should be a prime number",
                           default=7)

    ssaoColor: FloatVectorProperty(name="Color",
                                   description="The color of the ambient occlusion",
                                   subtype='COLOR_GAMMA',
                                   default=(0.0, 0.0, 0.0, 1.0),
                                   size=4,
                                   min=0,
                                   max=1)

    godRays: BoolProperty(
        name="God Rays",
        description="God Rays post-processing effect",
        default=False)

    godRaysDensity: FloatProperty(name="Density",
                                       description="The density of the light rays",
                                       default=0.96)

    godRaysDecay: FloatProperty(name="Decay",
                                description="An illumination decay factor",
                                default=0.92)

    godRaysWeight: FloatProperty(name="Weight",
                                 description="A light ray weight factor",
                                 default=0.3)

    godRaysExposure: FloatProperty(name="Exposure",
                                   description="A constant attenuation coefficient",
                                   default=0.54)

    godRaysSamples: IntProperty(name="Samples",
                                description="The number of samples per pixel",
                                default=60)

    godRaysClampMax: FloatProperty(name="Clamp Max",
                                   description="An upper bound for the saturation of the overall effect",
                                   default=1.0)

    pixelate: BoolProperty(
        name="Pixelate",
        description="Pixelate post-processing effect",
        default=False)

    pixelateGranularity: IntProperty(name="Granularity",
                                     description="The pixel granularity",
                                     default=6)

    @classmethod
    def init(cls, obj):
        obj.hubs_component_list.items.get(
            'environment-settings').isDependency = True
        obj.hubs_component_environment_settings.enableHDRPipeline = True

    def draw(self, context, layout, panel):
        hdrEnabled = context.scene.hubs_component_environment_settings.enableHDRPipeline
        if not hdrEnabled:
            row = layout.row(align=True)
            row.alert = True
            row.label(
                text="HDR Pipeline is required for Post-Processing effects to work")

        row = layout.row(align=True)
        row.enabled = hdrEnabled

        col = row.column()
        col.prop(data=self, property="glitch")
        if self.glitch:
            box = col.box()
            box.row().prop(data=self, property="glitchDelay")
            box.row().prop(data=self, property="glitchDuration")
            box.row().prop(data=self, property="glitchStrength")
            box.row().prop(data=self, property="glitchColumns")
            box.row().prop(data=self, property="glitchRatio")

        col.prop(data=self, property="outline")
        if self.outline:
            box = col.box()
            box.row().prop(data=self, property="outlineEdgeStrength")
            box.row().prop(data=self, property="outlineVisibleEdgeColor")

        col.prop(data=self, property="godRays")
        if self.godRays:
            box = col.box()
            box.row().prop(data=self, property="godRaysDensity")
            box.row().prop(data=self, property="godRaysDecay")
            box.row().prop(data=self, property="godRaysWeight")
            box.row().prop(data=self, property="godRaysExposure")
            box.row().prop(data=self, property="godRaysSamples")
            box.row().prop(data=self, property="godRaysClampMax")

        col.prop(data=self, property="pixelate")
        if self.pixelate:
            box = col.box()
            box.row().prop(data=self, property="pixelateGranularity")

        col.prop(data=self, property="ssao")
        if self.ssao:
            box = col.box()
            box.row().prop(data=self, property="ssaoIntensity")
            box.row().prop(data=self, property="ssaoFade")
            box.row().prop(data=self, property="ssaoSamples")
            box.row().prop(data=self, property="ssaoRings")
            box.row().prop(data=self, property="ssaoColor")
