import { INumberDictionary } from './types';
import './augmentations/binary-reader';
import { FBXReaderNode } from 'fbx-parser';
import { ISceneLoaderPluginAsync, ISceneLoaderPluginExtensions, ISceneLoaderProgressEvent, ISceneLoaderAsyncResult, Scene, AssetContainer, Bone, TransformNode, Material } from '@babylonjs/core';
import '@babylonjs/loaders';
import { IFBXGeometryResult } from './mesh/geometry';
import { IFBXSkeleton } from './mesh/skeleton';
import { IFBXConnections } from './connections';
export interface IFBXLoaderRuntime {
    scene: Scene;
    rootUrl: string;
    filePath: string;
    result: AssetContainer;
    objects: FBXReaderNode;
    models: FBXReaderNode[];
    deformers: FBXReaderNode[];
    geometries: FBXReaderNode[];
    connections: Map<number, IFBXConnections>;
    writeTextures: boolean;
    cachedModels: INumberDictionary<TransformNode | Bone>;
    cachedGeometries: INumberDictionary<IFBXGeometryResult>;
    cachedSkeletons: INumberDictionary<IFBXSkeleton>;
    cachedMaterials: INumberDictionary<Material>;
}
export declare class FBXLoader implements ISceneLoaderPluginAsync {
    writeTextures: boolean;
    /**
     * The friendly name of this plugin.
     */
    name: string;
    /**
     * The file extensions supported by this plugin.
     */
    extensions: ISceneLoaderPluginExtensions;
    /**
     * Constructor.
     * @param writeTextures definess wether or not texture should be written on disk or converted as blob Urls.
     */
    constructor(writeTextures?: boolean);
    /**
     * Import meshes into a scene.
     * @param meshesNames An array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param scene The scene to import into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @param onProgress The callback when the load progresses
     * @param fileName Defines the name of the file to load
     * @returns The loaded objects (e.g. meshes, particle systems, skeletons, animation groups, etc.)
     */
    importMeshAsync(meshesNames: any, scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<ISceneLoaderAsyncResult>;
    /**
     * Load into a scene.
     * @param scene The scene to load into.
     * @param data The data to import.
     * @param rootUrl The root url for scene and resources.
     * @param onProgress The callback when the load progresses.
     * @param fileName Defines the name of the file to load.
     */
    loadAsync(scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @param onProgress The callback when the load progresses
     * @param fileName Defines the name of the file to load
     * @returns The loaded asset container
     */
    loadAssetContainerAsync(scene: Scene, data: any, rootUrl: string, _?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<AssetContainer>;
}
