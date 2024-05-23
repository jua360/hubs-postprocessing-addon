from io_hubs_addon.components.hubs_component import HubsComponent
from io_hubs_addon.components.types import Category, PanelType, NodeType


class GodRays(HubsComponent):
    _definition = {
        'name': 'god-rays',
        'display_name': 'GodRays',
        'category': Category.USER,
        'node_type': NodeType.NODE,
        'panel_type': [PanelType.OBJECT],
        'icon': 'LIGHT_SUN',
        'version': (1, 0, 0)
    }
