"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXMesh = void 0;
const core_1 = require("@babylonjs/core");
class FBXMesh {
    /**
     * Creates the given mesh according to the given relationships.
     * @param runtime defines the reference to the current FBX runtime.
     * @param node defines the mesh FBX node.
     * @param connections defines the relationships of the FBX model node.
     * @returns the reference to the mesh created.
     */
    static CreateMesh(runtime, node, connections) {
        var _a;
        const mesh = new core_1.Mesh(node.prop(1, "string"), runtime.scene);
        const geometryId = connections.children.find((c) => runtime.cachedGeometries[c.id]);
        if (geometryId !== undefined) {
            const geometry = runtime.cachedGeometries[geometryId.id];
            geometry === null || geometry === void 0 ? void 0 : geometry.geometry.applyToMesh(mesh);
            if ((_a = geometry === null || geometry === void 0 ? void 0 : geometry.materialIndices) === null || _a === void 0 ? void 0 : _a.length) {
                let startIndex = 0;
                let prevMaterialIndex = geometry.materialIndices[0];
                const baseSubMesh = mesh.subMeshes[0];
                mesh.subMeshes = [];
                geometry.materialIndices.forEach((currentIndex, i) => {
                    if (currentIndex !== prevMaterialIndex) {
                        const count = i - startIndex;
                        new core_1.SubMesh(prevMaterialIndex, startIndex * 3, count * 3, startIndex, count, mesh, mesh, false, true);
                        prevMaterialIndex = currentIndex;
                        startIndex = i;
                    }
                });
                if (mesh.subMeshes.length > 0) {
                    const lastSubMesh = mesh.subMeshes[mesh.subMeshes.length - 1];
                    const lastIndex = lastSubMesh.indexStart + lastSubMesh.indexCount;
                    if (lastIndex !== geometry.materialIndices.length) {
                        const count = geometry.materialIndices.length - lastIndex;
                        new core_1.SubMesh(prevMaterialIndex, lastIndex * 3, count * 3, lastIndex, count, mesh, mesh, false, true);
                    }
                }
                else {
                    mesh.subMeshes.push(baseSubMesh);
                }
            }
        }
        mesh.computeWorldMatrix(true);
        // Material
        const materials = [];
        connections.children.forEach((c) => {
            if (runtime.cachedMaterials[c.id]) {
                materials.push(runtime.cachedMaterials[c.id]);
            }
        });
        if (materials.length > 1) {
            const multiMaterial = new core_1.MultiMaterial(mesh.name, runtime.scene);
            materials.forEach((m) => multiMaterial.subMaterials.push(m));
            mesh.material = multiMaterial;
        }
        else if (materials.length > 0) {
            mesh.material = materials[0];
        }
        runtime.result.meshes.push(mesh);
        return mesh;
    }
}
exports.FBXMesh = FBXMesh;
//# sourceMappingURL=mesh.js.map