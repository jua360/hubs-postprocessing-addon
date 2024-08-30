# Hubs Post-Processing Add-On
This add-on adds ThreeJs [post-processing](https://github.com/pmndrs/postprocessing) effects to Hubs.

As of now add-ons are not yet part of the main Hubs branch, so you'll need to use the Hubs client [add-ons branch](https://github.com/Hubs-Foundation/hubs/tree/addons) and install this add-on on it.

https://github.com/MozillaReality/hubs-postprocessing-addon/assets/837184/6c06f912-1be9-4d14-8e0a-67816257c993

## Install

1. Install the node-module:

```npm i https://github.com/MozillaReality/hubs-post-processing-addon.git```

2. Add the add-on to your Hubs client add-ons configuration file.

`addons.json`
```
{
  "addons": [
    ...
    "hubs-post-processing-addon", 
    ...
  ]
}

```
3. Create room in your Hubs instance.
4. Enable the add-on in the room configuration.

# Blender configuration
To create Blender scenes with support for the post-processing effects included in this add-on you'll need to add some extra components to the [Hubs Blender Add-on](https://github.com/MozillaReality/hubs-blender-exporter).

1. Checkout this project or download it as a zip file.
2. In the Hubs Blender Add-On preferences add a new components directory that points to the `blender` directory of this repository.
3. Restart Blender.
4. You should see the new components in the Hubs components menus.
