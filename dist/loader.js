"use strict";
// Shamely inspiered by ThreeJS FBX loader: https://threejs.org/examples/webgl_loader_fbx.html
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXLoader = void 0;
const path_1 = require("path");
require("./augmentations/binary-reader");
const parse_binary_1 = require("./augmentations/parse-binary");
const fbx_parser_1 = require("fbx-parser");
const core_1 = require("@babylonjs/core");
require("@babylonjs/loaders");
const mesh_1 = require("./mesh/mesh");
const geometry_1 = require("./mesh/geometry");
const material_1 = require("./material/material");
const animations_1 = require("./animation/animations");
const skeleton_1 = require("./mesh/skeleton");
const connections_1 = require("./connections");
const transform_1 = require("./node/transform");
class FBXLoader {
    /**
     * Constructor.
     * @param writeTextures definess wether or not texture should be written on disk or converted as blob Urls.
     */
    constructor(writeTextures = true) {
        this.writeTextures = writeTextures;
        /**
         * The friendly name of this plugin.
         */
        this.name = 'Babylon.JS FBX Loader';
        /**
         * The file extensions supported by this plugin.
         */
        this.extensions = {
            '.fbx': {
                isBinary: true,
            },
        };
        // Empty for now...
    }
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
    importMeshAsync(meshesNames, scene, data, rootUrl, onProgress, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Compute meshes names to import
            if (meshesNames) {
                meshesNames = Array.isArray(meshesNames) ? meshesNames : [meshesNames];
            }
            meshesNames !== null && meshesNames !== void 0 ? meshesNames : (meshesNames = []);
            const container = yield this.loadAssetContainerAsync(scene, data, rootUrl, onProgress, fileName);
            container.addAllToScene();
            return {
                lights: container.lights,
                meshes: container.meshes,
                skeletons: container.skeletons,
                geometries: container.geometries,
                transformNodes: container.transformNodes,
                animationGroups: container.animationGroups,
                particleSystems: container.particleSystems,
            };
        });
    }
    /**
     * Load into a scene.
     * @param scene The scene to load into.
     * @param data The data to import.
     * @param rootUrl The root url for scene and resources.
     * @param onProgress The callback when the load progresses.
     * @param fileName Defines the name of the file to load.
     */
    loadAsync(scene, data, rootUrl, onProgress, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = yield this.loadAssetContainerAsync(scene, data, rootUrl, onProgress, fileName);
            container.addAllToScene();
        });
    }
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @param onProgress The callback when the load progresses
     * @param fileName Defines the name of the file to load
     * @returns The loaded asset container
     */
    loadAssetContainerAsync(scene, data, rootUrl, _, fileName) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const result = new core_1.AssetContainer(scene);
            scene._blockEntityCollection = true;
            // Parse FBX
            let fbx;
            try {
                // try binary file encoding
                fbx = (0, parse_binary_1.parseBinary)(Buffer.from(data));
            }
            catch (e) {
                try {
                    // try text file encoding
                    fbx = (0, fbx_parser_1.parseText)(Buffer.from(data).toString('utf-8'));
                }
                catch (e) {
                    core_1.Logger.Error(`Can't parse FBX file. format is unknown or unsupported.`);
                    return result;
                }
            }
            const reader = new fbx_parser_1.FBXReader(fbx);
            // Check version first
            const version = (_c = (_b = (_a = reader.node('FBXHeaderExtension')) === null || _a === void 0 ? void 0 : _a.node('FBXVersion')) === null || _b === void 0 ? void 0 : _b.prop(0, 'number')) !== null && _c !== void 0 ? _c : 0;
            if (version < 7000) {
                core_1.Logger.Warn(`Can't parse FBX: version (${version}) not supported. FBX Loader supports versions >= 7000.`);
                return result;
            }
            // Build data
            const objects = reader.node('Objects');
            if (!objects) {
                return result;
            }
            const connections = connections_1.FBXConnections.ParseConnections(reader.node('Connections'));
            const models = objects.nodes('Model');
            if (!models) {
                return result;
            }
            const deformers = objects.nodes('Deformer');
            const geometries = objects.nodes('Geometry').filter((g) => g.prop(2, 'string') === 'Mesh');
            // Runtime
            const runtime = {
                scene,
                result,
                rootUrl,
                filePath: (0, path_1.join)((0, path_1.resolve)(rootUrl, fileName !== null && fileName !== void 0 ? fileName : '')),
                models,
                objects,
                deformers,
                geometries,
                writeTextures: this.writeTextures,
                cachedModels: {},
                cachedSkeletons: {},
                cachedMaterials: {},
                cachedGeometries: {},
                connections: connections_1.FBXConnections.ParseConnections(reader.node('Connections')),
            };
            // Parse materials
            material_1.FBXMaterial.ParseMaterials(runtime);
            // Parse raw skeletons
            skeleton_1.FBXSkeleton.ParseRawSkeletons(runtime);
            // Parse geometries
            geometry_1.FBXGeometry.ParseGeometries(runtime);
            // Build models
            for (const m of models) {
                const id = m.prop(0, 'number');
                const type = m.prop(2, 'string');
                const name = m.prop(1, 'string');
                const relationships = connections.get(id);
                if (!relationships) {
                    continue;
                }
                skeleton_1.FBXSkeleton.CheckSkeleton(runtime, m, name, relationships);
                let model = null;
                switch (type) {
                    case 'Mesh':
                        model = mesh_1.FBXMesh.CreateMesh(runtime, m, relationships);
                        break;
                    case 'Light':
                    case 'Camera':
                    case 'NurbsCurve':
                        break;
                    case 'Root':
                    case 'LimbNode':
                        // model = scene.getBoneByName(`Deformer::-${name}`);
                        break;
                    case 'Null':
                    default:
                        model = new core_1.TransformNode(name, scene, true);
                        result.transformNodes.push(model);
                        break;
                }
                if (model) {
                    runtime.cachedModels[id] = model;
                    transform_1.FBXTransform.ParseTransform(model, m);
                }
            }
            // Parenting
            for (const modelKey in runtime.cachedModels) {
                const modelId = parseInt(modelKey);
                const model = runtime.cachedModels[modelKey];
                const parentConnections = (_d = connections.get(modelId)) === null || _d === void 0 ? void 0 : _d.parents;
                parentConnections === null || parentConnections === void 0 ? void 0 : parentConnections.forEach((p) => {
                    const parent = runtime.cachedModels[p.id];
                    if (parent) {
                        model.parent = parent;
                    }
                });
                model.computeWorldMatrix(true);
            }
            // Apply transform
            for (const m in runtime.cachedModels) {
                const model = runtime.cachedModels[m];
                transform_1.FBXTransform.ApplyTransform(model);
            }
            // Bind skeletons
            skeleton_1.FBXSkeleton.BindSkeletons(runtime);
            // Parse animation groups
            animations_1.FBXAnimations.ParseAnimationGroups(runtime);
            scene._blockEntityCollection = false;
            return result;
        });
    }
}
exports.FBXLoader = FBXLoader;
//# sourceMappingURL=loader.js.map