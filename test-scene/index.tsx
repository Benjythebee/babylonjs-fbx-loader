import { ArcRotateCamera, SceneLoader, Vector3 } from '@babylonjs/core'
// import { FBXLoader } from '../src/loader'
import { FBXLoader } from '../src'
import { generate } from './create-scene'

let { engine, scene, canvas } = generate()
if (SceneLoader) {
  //Add this loader into the register plugin
  SceneLoader.RegisterPlugin(new FBXLoader())
}

setTimeout(async () => {
  let mesh = await SceneLoader.ImportMeshAsync(null, 'https://dl.dropboxusercontent.com/s/', '8s3d16fs5h4scmk/wolf_w_texture.fbx?dl=0', scene!, (e) => console.log(e))
  console.log(mesh)
  ;(scene.activeCamera! as ArcRotateCamera).setTarget(new Vector3(...mesh.meshes[0].position.asArray()))
}, 1000)
