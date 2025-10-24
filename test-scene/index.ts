import { ArcRotateCamera, SceneLoader, Vector3 } from '@babylonjs/core'
import { RegisterSceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from '@babylonjs/core'
// import { FBXLoader } from '../src/loader'
import { FBXLoader } from '../src'
import { generate } from './create-scene'

if (RegisterSceneLoaderPlugin) {
  //Add this loader into the register plugin
  RegisterSceneLoaderPlugin(new FBXLoader())
}

let scene: Scene
function start() {
  scene = generate().scene

  scene.onPointerDown = (evt, pickResult) => {
    const mesh = pickResult.pickedMesh
    if (mesh) {
      console.log(mesh)
      ;(window as any).mesh = mesh
    }
  }
}
start()
let loadWolfButton = document.getElementById('wolf')!
let loadMechaButton = document.getElementById('mecha')!

const cleanScene = () => {
  scene.dispose()
  start()
}

setTimeout(() => {
  loadWolfModel()
}, 1000)

async function loadWolfModel() {
  let result = await SceneLoader.ImportMeshAsync(null, 'https://dl.dropboxusercontent.com/s/', '8s3d16fs5h4scmk/wolf_w_texture.fbx?dl=0', scene!)
  console.log(result)
  result.meshes.forEach((mesh) => {
    mesh.isPickable = true
    mesh.scaling.scaleInPlace(0.1)
  })
  // Uncomment to obtain animations
  // const idle = scene.getAnimationGroupByName('AnimStack::Wolf_Skeleton|Wolf_Skeleton|Wolf_Skeleton|Wolf_Idle_|Wolf_Skeleton|Wolf_Idle_')
  // if (idle) {
  //   //Play the Samba animation
  //   idle.start(true, 1.0, idle.from, idle.to, false)
  // }
}

loadWolfButton.onclick = () => {
  cleanScene()
  loadWolfModel()
}

async function loadMechaModel() {
  let result = await SceneLoader.ImportMeshAsync(null, 'https://dl.dropboxusercontent.com/s/', 'cslh6rl8d14v7pb/Left_Arm_01_Glacier.fbx?dl=0', scene!)
  console.log(result)
  result.meshes.forEach((mesh) => {
    mesh.isPickable = true
    mesh.scaling.scaleInPlace(0.05)
  })
}

loadMechaButton.onclick = () => {
  cleanScene()
  loadMechaModel()
}
