from io_hubs_addon.components.hubs_component import HubsComponent
from io_hubs_addon.components.types import Category, PanelType, NodeType


class Outlined(HubsComponent):
    _definition = {
        'name': 'outlined',
        'display_name': 'Outlined',
        'category': Category.USER,
        'node_type': NodeType.NODE,
        'panel_type': [PanelType.OBJECT],
        'icon': 'MATSHADERBALL',
        'version': (1, 0, 0)
    }
