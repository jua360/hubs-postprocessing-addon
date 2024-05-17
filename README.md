# Hubs Post-Processing Add-On
This add-on adds ThreeJs [post-processing](https://github.com/pmndrs/postprocessing) effects to Hubs.

As of now add-ons are not yet part of the main Hubs branch, so you'll need to use the Hubs client [add-ons branch](https://github.com/mozilla/hubs/tree/addons) and install this add-on on it.

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
