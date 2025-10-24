import { SceneLoader } from '@babylonjs/core'
import { RegisterSceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader";
import { Scene } from '@babylonjs/core'
// import { FBXLoader } from '../src/loader'
import { FBXLoader } from 'babylonjs-fbx-loader'
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

/**
 * Start the scene
 */
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


// Drag and drop functionality
document.addEventListener('dragover', (event) => {
  event.preventDefault()
})

document.addEventListener('drop', async (event) => {
  event.preventDefault()
  
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return
  
  const file = files[0]
  if (!file.name.toLowerCase().endsWith('.fbx')) {
    console.log('Please drop an FBX file')
    return
  }
  
  const url = URL.createObjectURL(file)
  
  try {
    cleanScene()
    const result = await SceneLoader.ImportMeshAsync(null, '', url, scene,null,'.fbx')
    console.log('Loaded FBX file:', result)
    result.meshes.forEach((mesh) => {
      mesh.isPickable = true
      mesh.scaling.scaleInPlace(0.05)
    })
  } catch (error) {
    console.error('Error loading FBX file:', error)
  } finally {
    URL.revokeObjectURL(url)
  }
})