# FBX Loader plugin for Babylonjs
This is an opensource plugin to load FBX files in BabylonJS.
The code was extracted from the [BabylonJS Editor repo](https://github.com/BabylonJS/Editor/blob/master/src/renderer/editor/loaders/fbx/loader.ts) so props goes to the dev team over there.

The goal of this plugin is to allow FBX loading on BABYLONJS web.

## Development

1. Clone repo
2. Install dependencies using `npm i`
3. Make sure your code is formatted using prettier;
either activate "format on save" on your IDE or run `npm run format`

4. Run `npm run test` to run a web page at `http://localhost:9000` that will attempt to load an FBX file in a babylon scene


## Testing

There are currently no tests;

See step 4 above.

## Contributing
Feel free to make a PR and help out!


## Todo:
- [ ] Clean up unused functions and code from the Editor repo
- [ ] Load material from the FBX
- [ ] Add better test file than the current dropbox link in the index.html test file
- [ ] Add tests
- [ ] add more to this todo list


## How to use

Using babylonjs libraries
```js
import 'babylonjs';
import {FBXLoader} from "babylonjs-fbx-loader"

if (BABYLON.SceneLoader) {
  //Add this loader into the register plugin
  BABYLON.SceneLoader.RegisterPlugin(new FBXLoader())
}

[...]


let mesh = await BABYLON.SceneLoader.ImportMeshAsync(null, 'path/to', 'filename.fbx', scene)
```

Using ES6 babylon libraries

```js
import {FBXLoader} from "babylonjs-fbx-loader"
import {SceneLoader} from "@babylonjs/core"

if (SceneLoader) {
  //Add this loader into the register plugin
  SceneLoader.RegisterPlugin(new FBXLoader())
}

[...]

let mesh = await SceneLoader.ImportMeshAsync(null, 'path/to', 'filename.fbx', scene)
```
