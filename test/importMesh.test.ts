import { Camera, Scene, SceneLoader, Vector3 } from '@babylonjs/core'
// Hack to make loading assets work in testing environment
//@ts-ignore
import XMLHttpRequest from 'xhr2'
global.XMLHttpRequest = XMLHttpRequest
import { NullEngine } from '@babylonjs/core/Engines/nullEngine'
import { fail } from 'assert'
import { FBXLoader } from '../src'

describe('Test Import', function () {
  let scene: Scene
  beforeAll(() => {
    const engine = new NullEngine()
    scene = new Scene(engine)

    let camera = new Camera('camera-test', Vector3.Zero(), scene)
    scene.activeCameras?.push(camera)

    engine.runRenderLoop(() => {
      scene.render()
    })
  })

  afterAll(() => {
    scene.getEngine().stopRenderLoop()
    scene?.dispose()
  })

  test('Scene exists', () => {
    expect(scene).toBeDefined()
  })

  test('load plugin', (done) => {
    if (SceneLoader) {
      //Add this loader into the register plugin
      SceneLoader.RegisterPlugin(new FBXLoader())
    }
    expect(SceneLoader.IsPluginForExtensionAvailable('.fbx')).toBe(true)
    done()
  })

  test('Should import glb', (done) => {
    SceneLoader.ImportMesh(
      null,
      'https://dl.dropboxusercontent.com/s/',
      'rfmlp9x5wwz5y6k/head_mecha.glb?dl=0',
      scene!,
      (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries) => {
        expect(meshes.length).toBeGreaterThan(0)
        expect(geometries.length).toBeGreaterThan(0)
        for (const mesh of meshes) {
          expect(typeof mesh.id).toBeDefined()
          expect(typeof mesh.id).toBe('string')
        }
        done()
      },
      null,
      (e) => {
        console.error(e)
        fail('Could not import fbx')
      }
    )
  })

  test('Should import FBX arm', (done) => {
    SceneLoader.ImportMesh(
      null,
      'https://dl.dropboxusercontent.com/s/',
      '1ulh9r4vhu9idfx/Left_Arm_03_Return_To_Nature.fbx?dl=0',
      scene!,
      (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries) => {
        expect(meshes.length).toBeGreaterThan(0)
        expect(geometries.length).toBeGreaterThan(0)
        for (const mesh of meshes) {
          expect(typeof mesh.id).toBeDefined()
          expect(typeof mesh.id).toBe('string')
        }
        done()
      },
      null,
      (e) => {
        console.error(e)
        fail('Could not import fbx')
      }
    )
  })

  test('Should import wolf', (done) => {
    // free wolf FBX model taken from https://free3d.com/3d-model/wolf-rigged-and-game-ready-42808.html
    SceneLoader.ImportMesh(
      null,
      'https://dl.dropboxusercontent.com/s/',
      '8s3d16fs5h4scmk/wolf_w_texture.fbx?dl=0',
      scene!,
      (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries) => {
        expect(meshes.length).toBeGreaterThan(0)
        expect(geometries.length).toBeGreaterThan(0)
        expect(skeletons.length).toBeGreaterThan(0)
        for (const mesh of meshes) {
          expect(typeof mesh.id).toBeDefined()
          expect(typeof mesh.id).toBe('string')
          expect(mesh.id.includes('Model::Wolf')).toBeTruthy()
        }
        done()
      },
      null,
      (e) => {
        console.error(e)
        fail('Could not import fbx')
      }
    )
  })
})
