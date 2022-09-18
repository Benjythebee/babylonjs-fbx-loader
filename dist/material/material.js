"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXMaterial = void 0;
const path_1 = require("path");
const core_1 = require("@babylonjs/core");
class FBXMaterial {
    /**
     * Parses all available materials in the FBX file.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseMaterials(runtime) {
        var _a, _b, _c;
        const videos = this._ParseVideos(runtime.scene, runtime.objects, runtime.rootUrl, runtime.writeTextures);
        const textures = this._ParseTextures(runtime.objects, runtime.connections, videos);
        const materials = runtime.objects.nodes('Material');
        for (const m of materials) {
            const id = m.prop(0, 'number');
            const name = m.prop(1, 'string');
            const material = new core_1.StandardMaterial(name, runtime.scene);
            material.id = id.toString();
            runtime.result.materials.push(material);
            const properties = (_b = (_a = m.node('Properties70')) === null || _a === void 0 ? void 0 : _a.nodes('P')) !== null && _b !== void 0 ? _b : [];
            properties.forEach((p) => {
                const type = p.prop(0, 'string');
                switch (type) {
                    case 'Diffuse':
                    case 'DiffuseColor':
                        material.diffuseColor = new core_1.Color3(p.prop(4, 'number'), p.prop(5, 'number'), p.prop(6, 'number'));
                        break;
                    case 'Specular':
                    case 'SpecularColor':
                        material.specularColor = new core_1.Color3(p.prop(4, 'number'), p.prop(5, 'number'), p.prop(6, 'number'));
                        break;
                    case 'Ambient':
                    case 'AmbientColor':
                        material.ambientColor = new core_1.Color3(p.prop(4, 'number'), p.prop(5, 'number'), p.prop(6, 'number'));
                        break;
                    case 'Emissive':
                    case 'EmissiveColor':
                        material.emissiveColor = new core_1.Color3(p.prop(4, 'number'), p.prop(5, 'number'), p.prop(6, 'number'));
                        break;
                }
            });
            const relationships = runtime.connections.get(id);
            (_c = relationships === null || relationships === void 0 ? void 0 : relationships.children) === null || _c === void 0 ? void 0 : _c.forEach((c) => {
                const texture = textures[c.id];
                if (!texture) {
                    return;
                }
                const type = c.relationship;
                switch (type) {
                    case 'DiffuseColor':
                    case 'Maya|TEX_color_map':
                        material.diffuseTexture = texture;
                        break;
                    case 'Bump':
                    case 'NormalMap':
                    case 'Maya|TEX_normal_map':
                        material.bumpTexture = texture;
                        break;
                    case 'SpecularColor':
                        material.specularTexture = texture;
                        break;
                    case 'Maya|TEX_ao_map':
                        material.ambientTexture = texture;
                        break;
                }
            });
            runtime.cachedMaterials[id] = material;
        }
    }
    /**
     * Configures all the given textures.
     */
    static _ParseTextures(objects, connections, videos) {
        var _a, _b, _c, _d, _e, _f;
        const result = {};
        const textures = objects.nodes('Texture');
        for (const t of textures) {
            const id = t.prop(0, 'number');
            const videoId = (_b = (_a = connections.get(id)) === null || _a === void 0 ? void 0 : _a.children[0]) === null || _b === void 0 ? void 0 : _b.id;
            if (videoId === undefined) {
                continue;
            }
            const video = videos[videoId];
            if (!video) {
                continue;
            }
            result[id] = video;
            // Configure texture
            const modelUVTranslation = t.node('ModelUVTranslation');
            if (modelUVTranslation) {
                video.uOffset = (_c = modelUVTranslation.prop(0, 'number')) !== null && _c !== void 0 ? _c : 0;
                video.vOffset = (_d = modelUVTranslation.prop(1, 'number')) !== null && _d !== void 0 ? _d : 0;
            }
            const modelUVScaling = t.node('ModelUVScaling');
            if (modelUVScaling) {
                video.uScale = (_e = modelUVScaling.prop(0, 'number')) !== null && _e !== void 0 ? _e : 1;
                video.vScale = (_f = modelUVScaling.prop(1, 'number')) !== null && _f !== void 0 ? _f : 1;
            }
        }
        return result;
    }
    /**
     * Parses all the available Video FBX nodes and returns the created textures dictionary.
     */
    static _ParseVideos(scene, objects, rootUrl, writeTextures) {
        var _a, _b, _c, _d, _e, _f;
        const videos = objects.nodes('Video');
        const result = {};
        for (const v of videos) {
            let filePath = (_b = (_a = v.node('RelativeFilename')) === null || _a === void 0 ? void 0 : _a.prop(0, 'string')) !== null && _b !== void 0 ? _b : (_c = v.node('Filename')) === null || _c === void 0 ? void 0 : _c.prop(0, 'string');
            if (!filePath) {
                continue;
            }
            filePath = filePath.replace(/\\/g, '/');
            const extension = (0, path_1.extname)(filePath).toLowerCase();
            if (this._SupportedTextureTypes.indexOf(extension) === -1) {
                continue;
            }
            const id = v.prop(0, 'number');
            const useMipMap = (_e = (_d = v.node('UseMipMap')) === null || _d === void 0 ? void 0 : _d.prop(0)) !== null && _e !== void 0 ? _e : 0;
            const fileName = (0, path_1.basename)(filePath);
            let fileUrl = (0, path_1.join)(rootUrl, fileName);
            const content = (_f = v.node('Content')) === null || _f === void 0 ? void 0 : _f.prop(0);
            if (!Buffer.isBuffer(content)) {
                continue;
            }
            if (!content.length) {
                continue;
            }
            if (content.length) {
                if (writeTextures) {
                    //@TODO: understand what this is for.
                    //writeFileSync(fileUrl, Buffer.from(content), { encoding: 'binary' })
                }
                else {
                    const blob = new Blob([content]);
                    fileUrl = URL.createObjectURL(blob);
                }
            }
            const texture = new core_1.Texture(fileUrl, scene, !useMipMap, undefined, undefined, undefined, () => {
                if (!writeTextures) {
                    URL.revokeObjectURL(fileUrl);
                }
            });
            if (!writeTextures) {
                texture.onLoadObservable.addOnce(() => URL.revokeObjectURL(fileUrl));
            }
            result[id] = texture;
        }
        return result;
    }
}
exports.FBXMaterial = FBXMaterial;
FBXMaterial._SupportedTextureTypes = ['.png', '.jpg', '.jpeg', '.bmp'];
//# sourceMappingURL=material.js.map