"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXSkeleton = void 0;
const core_1 = require("@babylonjs/core");
const transform_1 = require("../node/transform");
class FBXSkeleton {
    /**
     * Parses the raw skeletons.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseRawSkeletons(runtime) {
        for (const d of runtime.deformers) {
            const deformerId = d.prop(0, "number");
            const deformerType = d.prop(2, "string");
            const relationShips = runtime.connections.get(deformerId);
            if (deformerType === "Skin") {
                const id = d.prop(0, "number");
                const name = d.prop(1, "string");
                const existingSkeleton = runtime.cachedSkeletons[id];
                if (!existingSkeleton) {
                    const bones = runtime.deformers.filter((d) => relationShips === null || relationShips === void 0 ? void 0 : relationShips.children.find((r) => r.id === d.prop(0, "number")));
                    const skeleton = this._GetRawSkeleton(id, name, bones, runtime.scene);
                    runtime.cachedSkeletons[id] = skeleton;
                    runtime.result.skeletons.push(skeleton.skeletonInstance);
                }
            }
        }
    }
    /**
     * Returns the parsed raw skeleton to be built later inline with the geometries.
     */
    static _GetRawSkeleton(id, name, deformers, scene) {
        const rawBones = [];
        deformers.forEach((d) => {
            var _a, _b, _c, _d;
            if (d.prop(2, "string") !== "Cluster") {
                return;
            }
            const rawBone = {
                id: d.prop(0, "number"),
                indices: (_b = (_a = d.node("Indexes")) === null || _a === void 0 ? void 0 : _a.prop(0, "number[]")) !== null && _b !== void 0 ? _b : [],
                weights: (_d = (_c = d.node("Weights")) === null || _c === void 0 ? void 0 : _c.prop(0, "number[]")) !== null && _d !== void 0 ? _d : [],
                transform: core_1.Matrix.FromArray(d.node("Transform").prop(0, "number[]")),
                transformLink: core_1.Matrix.FromArray(d.node("TransformLink").prop(0, "number[]")),
            };
            rawBones.push(rawBone);
        });
        const skeletonInstance = new core_1.Skeleton(name, 0, scene);
        return {
            id,
            rawBones,
            bones: [],
            skeletonInstance,
        };
    }
    /**
     * Checks the given connections to compute bones.
     * @param runtime defines the reference to the current FBX runtime.
     * @param name defines the name of the bone.
     * @param connections defines the relationships of the FBX model node.
     * @returns the reference to the last bone created.
     */
    static CheckSkeleton(runtime, model, name, connections) {
        connections.parents.forEach((p) => {
            for (const skeletonId in runtime.cachedSkeletons) {
                const skeleton = runtime.cachedSkeletons[skeletonId];
                skeleton.rawBones.forEach((b, index) => {
                    if (b.id !== p.id) {
                        return;
                    }
                    const boneId = model.prop(0, "number").toString();
                    const boneName = `${skeleton.skeletonInstance.name}-${name}`;
                    if (skeleton.skeletonInstance.bones.find((b) => b.name === boneName)) {
                        return;
                    }
                    const bone = new core_1.Bone(boneName, skeleton.skeletonInstance);
                    bone.id = boneId;
                    bone._index = index;
                    // Bones can be shared, let's parse transform here.
                    transform_1.FBXTransform.ParseTransform(bone, model);
                    bone.metadata.connections = connections;
                    skeleton.bones[index] = bone;
                });
            }
        });
    }
    /**
     * Binds the given skeletons to the associated meshes.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static BindSkeletons(runtime) {
        var _a, _b;
        const poseMatrices = {};
        // Parse pose matrices
        const bindPoseNodes = runtime.objects.nodes("Pose");
        bindPoseNodes.forEach((bpn) => {
            const poseNodes = bpn.nodes("PoseNode");
            poseNodes.forEach((pn) => {
                const nodeId = pn.node("Node").prop(0, "number");
                const matrix = pn.node("Matrix").prop(0, "number[]");
                poseMatrices[nodeId] = core_1.Matrix.FromArray(matrix);
            });
        });
        // Compute parenting, matrices and assign
        for (const skeletonId in runtime.cachedSkeletons) {
            const skeleton = runtime.cachedSkeletons[skeletonId];
            for (const b of skeleton.skeletonInstance.bones) {
                const boneIndex = (_a = b._index) !== null && _a !== void 0 ? _a : -1;
                const rawBone = skeleton.rawBones[boneIndex];
                if (!rawBone) {
                    continue;
                }
                // Parenting
                const connections = b.metadata.connections;
                connections === null || connections === void 0 ? void 0 : connections.parents.forEach((p) => {
                    const parentBone = skeleton.skeletonInstance.bones.find((b) => b.id === p.id.toString());
                    if (parentBone) {
                        b.setParent(parentBone);
                    }
                });
                // const transformData = FBXTransform.GetTransformData(b);
                transform_1.FBXTransform.ApplyTransform(b);
                /*
                        let baseMatrix = Matrix.Identity();
                        if (rawBone.transformLink && boneIndex !== -1) {
                            baseMatrix.copyFrom(FBXUtils.GetMatrix(rawBone.transformLink, transformData));
                        }
        
                        const parentBone = b.getParent();
                        if (parentBone) {
                            baseMatrix.multiplyToRef(parentBone.getInvertedAbsoluteTransform(), baseMatrix);
                        }
                        */
                b.setRestPose(b.getLocalMatrix());
                b.updateMatrix(b.getLocalMatrix(), false, false);
                b._updateDifferenceMatrix(undefined, true);
            }
            // Assign
            const parents = (_b = runtime.connections.get(parseInt(skeletonId))) === null || _b === void 0 ? void 0 : _b.parents;
            parents === null || parents === void 0 ? void 0 : parents.forEach((p) => {
                var _a;
                const parents2 = (_a = runtime.connections.get(p.id)) === null || _a === void 0 ? void 0 : _a.parents;
                parents2 === null || parents2 === void 0 ? void 0 : parents2.forEach((p) => {
                    const model = runtime.cachedModels[p.id];
                    if (model && model instanceof core_1.AbstractMesh) {
                        const poseMatrix = poseMatrices[p.id];
                        if (poseMatrix && !poseMatrix.isIdentity()) {
                            model.updatePoseMatrix(poseMatrix);
                            skeleton.skeletonInstance.needInitialSkinMatrix = true;
                        }
                        model.skeleton = skeleton.skeletonInstance;
                        model.skeleton.bones.forEach((b) => {
                            b.name = `${model.name}-${b.name}`;
                        });
                        // model.skeleton.sortBones();
                        // model.skeleton.returnToRest();
                    }
                });
            });
        }
    }
}
exports.FBXSkeleton = FBXSkeleton;
//# sourceMappingURL=skeleton.js.map