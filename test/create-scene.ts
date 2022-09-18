import { DirectionalLight, HemisphericLight, MeshBuilder, ShadowGenerator, StandardMaterial } from '@babylonjs/core'
import { ActionManager } from '@babylonjs/core/Actions/actionManager'
import { ArcRotateCamera } from '@babylonjs/core/Cameras'
import { Engine } from '@babylonjs/core/Engines/engine'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import '@babylonjs/loaders'
import { Vector3 } from '@babylonjs/core/Maths'
import { Scene } from '@babylonjs/core/scene'

const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  // scene
  const scene = new Scene(engine)
  ;(window as any).scene = scene
  // scene.clearColor = new Color4(1, 1, 1, 1)

  // Camera
  const camera = new ArcRotateCamera('Camera', 1.57, 1.4, 2.4, new Vector3(0, 0, 0), scene)
  camera.setTarget(new Vector3(0, 1, 0))
  camera.beta = 1.4
  camera.attachControl(canvas, true)
  camera.lowerRadiusLimit = 1.5
  camera.upperRadiusLimit = 10
  camera.wheelPrecision = 100

  // camera.viewport = new Viewport(0, 0, 0, 0)
  scene.activeCameras!.push(camera)
  scene.activeCamera = camera
  // Lighting
  const c = 20
  const lightOffset = new Vector3(1, -1, -1).multiplyByFloats(c, c, c)
  let light = new DirectionalLight('dir01', new Vector3(1, -1, -1), scene)
  light.intensity = 1
  light.position.copyFrom(scene.activeCamera.position.add(lightOffset))

  const h = new HemisphericLight('hemi', new Vector3(0.2, 0.2, 0.2), scene)
  h.intensity = 0.6

  scene.actionManager = new ActionManager(scene)

  // window resize
  window.addEventListener('resize', () => {
    engine.resize()
  })

  engine.runRenderLoop(() => {
    scene.render()
  })
  return scene
}

export const generate = () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  if (!canvas) {
    throw new Error('No canvas found.')
  }
  canvas.style.cssText = 'width: 100%;height:100%; touch-action: none;'

  SceneLoader.ShowLoadingScreen = false

  const engine = new Engine(canvas, true, { antialias: true, stencil: true })

  let scene = createScene(engine, canvas)
  return { engine, scene, canvas }
}
