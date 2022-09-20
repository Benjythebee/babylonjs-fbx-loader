import { ArcRotateCamera, SceneLoader, Vector3 } from '@babylonjs/core'
// import { FBXLoader } from '../src/loader'
import { FBXLoader } from '../src'
import { generate } from './create-scene'

let { engine, scene, canvas } = generate()
if (SceneLoader) {
  //Add this loader into the register plugin
  SceneLoader.RegisterPlugin(new FBXLoader())
}

scene.onPointerDown = (evt, pickResult) => {
  const mesh = pickResult.pickedMesh
  if (mesh) {
    console.log(mesh)
    ;(window as any).mesh = mesh
  }
}

setTimeout(async () => {
  let result = await SceneLoader.ImportMeshAsync(null, 'https://dl.dropboxusercontent.com/s/', '8s3d16fs5h4scmk/wolf_w_texture.fbx?dl=0', scene!)
  console.log(result)
  result.meshes.forEach((mesh) => {
    mesh.isPickable = true
    mesh.scaling.scaleInPlace(0.1)
  })
  ;(scene.activeCamera! as ArcRotateCamera).setPosition(new Vector3(32, 39, 47))
  ;(scene.activeCamera! as ArcRotateCamera).setTarget(new Vector3(...result.meshes[0].position.asArray()))
  //Get the Samba animation Group
  const idle = scene.getAnimationGroupByName('AnimStack::Wolf_Skeleton|Wolf_Skeleton|Wolf_Skeleton|Wolf_Idle_|Wolf_Skeleton|Wolf_Idle_')
  if (idle) {
    //Play the Samba animation
    idle.start(true, 1.0, idle.from, idle.to, false)
  }
}, 1000)
