"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXAnimations = void 0;
const core_1 = require("@babylonjs/core");
const utils_1 = require("../utils");
class FBXAnimations {
    /**
     * Creates the animation groups available in the FBX file, ignored if no clip defined.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseAnimationGroups(runtime) {
        const animationCurveNodes = runtime.objects.nodes("AnimationCurve");
        if (!animationCurveNodes.length) {
            return;
        }
        const curveNodesMap = this._PrepareAnimationCurves(runtime.objects);
        this._ParseAnimationCurves(runtime.objects, runtime.connections, curveNodesMap);
        const layersMap = this._ParseAnimationLayers(runtime.objects, runtime.connections, runtime.cachedModels, runtime.cachedSkeletons, curveNodesMap);
        const rawClips = this._ParseAnimationStacks(runtime.objects, runtime.connections, layersMap);
        return this._CreateAnimationGroups(runtime, rawClips);
    }
    /**
     * Creates the animation groups according to the given parsed clips.
     */
    static _CreateAnimationGroups(runtime, clips) {
        clips.forEach((c) => {
            const animationGroup = new core_1.AnimationGroup(c.name, runtime.scene);
            runtime.result.animationGroups.push(animationGroup);
            c.layers.forEach((l) => {
                this._AddClip(animationGroup, l, runtime.cachedModels, runtime.cachedSkeletons);
            });
        });
    }
    /**
     * Adds the given clip to the animation group.
     */
    static _AddClip(animationGroup, layer, cachedModels, cachedSkeletons) {
        // Check targets
        const targets = this._GetTargets(layer.modelId, cachedModels, cachedSkeletons);
        if (!targets.length) {
            return;
        }
        // Initial transform
        let position = core_1.Vector3.Zero();
        let rotation = core_1.Quaternion.Identity();
        let scaling = core_1.Vector3.One();
        if (layer.transform) {
            layer.transform.decompose(scaling, rotation, position);
        }
        let initialScale = scaling.asArray();
        let initialPosition = position.asArray();
        let initialRotation = rotation.toEulerAngles().asArray();
        // Position
        if (layer.T && Object.keys(layer.T.curves).length > 0) {
            const curves = layer.T.curves;
            const positionTimes = this._GetTimes(curves);
            const positions = this._GetKeyFrameAnimationValues(positionTimes, curves, initialPosition);
            positions.forEach((p) => (p.x = -p.x));
            targets.forEach((t) => {
                const animation = new core_1.Animation(`${t.name}.position`, "position", 1, core_1.Animation.ANIMATIONTYPE_VECTOR3, core_1.Animation.ANIMATIONLOOPMODE_CYCLE, false);
                animation.setKeys(positionTimes.map((t, index) => ({
                    frame: t,
                    value: positions[index],
                })));
                animationGroup.addTargetedAnimation(animation, t);
            });
        }
        // Rotation
        if (layer.R && Object.keys(layer.R.curves).length > 0) {
            const curves = layer.R.curves;
            if (curves.x) {
                this._InterpolateRotations(curves.x);
                curves.x.values = curves.x.values.map((v) => core_1.Tools.ToRadians(v));
            }
            if (curves.y) {
                this._InterpolateRotations(curves.y);
                curves.y.values = curves.y.values.map((v) => core_1.Tools.ToRadians(v));
            }
            if (curves.z) {
                this._InterpolateRotations(curves.z);
                curves.z.values = curves.z.values.map((v) => core_1.Tools.ToRadians(v));
            }
            const rotationTimes = this._GetTimes(curves);
            const rotations = this._GetKeyFrameAnimationValues(rotationTimes, curves, initialRotation);
            const rotationQuaternions = rotations.map((r) => {
                let finalRotation;
                const preRotation = layer.preRotation;
                const postRotation = layer.postRotation;
                if (preRotation || postRotation) {
                    finalRotation = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(r);
                    if (preRotation) {
                        const pre = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(preRotation);
                        finalRotation = pre.multiply(finalRotation);
                    }
                    if (postRotation) {
                        const post = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(postRotation);
                        finalRotation = finalRotation.multiply(core_1.Quaternion.Inverse(post));
                    }
                }
                else {
                    finalRotation = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(r);
                }
                return finalRotation;
            });
            targets.forEach((target) => {
                const animation = new core_1.Animation(`${target.name}.rotationQuaternion`, "rotationQuaternion", 1, core_1.Animation.ANIMATIONTYPE_QUATERNION, core_1.Animation.ANIMATIONLOOPMODE_CYCLE, false);
                animation.setKeys(rotationTimes.map((frame, index) => {
                    const value = rotationQuaternions[index];
                    return { frame, value };
                }));
                animationGroup.addTargetedAnimation(animation, target);
            });
        }
        // Scaling
        if (layer.S && Object.keys(layer.S.curves).length > 0) {
            const curves = layer.S.curves;
            const scalingTimes = this._GetTimes(curves);
            const scalings = this._GetKeyFrameAnimationValues(scalingTimes, curves, initialScale);
            targets.forEach((t) => {
                const animation = new core_1.Animation(`${t.name}.scaling`, "scaling", 1, core_1.Animation.ANIMATIONTYPE_VECTOR3, core_1.Animation.ANIMATIONLOOPMODE_CYCLE, false);
                animation.setKeys(scalingTimes.map((t, index) => ({
                    frame: t,
                    value: scalings[index],
                })));
                animationGroup.addTargetedAnimation(animation, t);
            });
        }
    }
    /**
     * Interpolates the given rotation curve.
     */
    static _InterpolateRotations(curve) {
        const inject = (a1, index, a2) => {
            return a1.slice(0, index).concat(a2).concat(a1.slice(index));
        };
        for (let i = 1; i < curve.values.length; i++) {
            const initialValue = curve.values[i - 1];
            const valuesSpan = curve.values[i] - initialValue;
            const absoluteSpan = Math.abs(valuesSpan);
            if (absoluteSpan >= 180) {
                const numSubIntervals = absoluteSpan / 180;
                const step = valuesSpan / numSubIntervals;
                let nextValue = initialValue + step;
                const initialTime = curve.times[i - 1];
                const timeSpan = curve.times[i] - initialTime;
                const interval = timeSpan / numSubIntervals;
                let nextTime = initialTime + interval;
                const interpolatedTimes = [];
                const interpolatedValues = [];
                while (nextTime < curve.times[i]) {
                    interpolatedTimes.push(nextTime);
                    nextTime += interval;
                    interpolatedValues.push(nextValue);
                    nextValue += step;
                }
                curve.times = inject(curve.times, i, interpolatedTimes);
                curve.values = inject(curve.values, i, interpolatedValues);
            }
        }
    }
    /**
     * Returns the animationt's values as Vector3.
     */
    static _GetKeyFrameAnimationValues(times, curves, initialValue) {
        const values = [];
        const prevValue = initialValue;
        let xIndex = -1;
        let yIndex = -1;
        let zIndex = -1;
        times.forEach(function (time) {
            if (curves.x)
                xIndex = curves.x.times.indexOf(time);
            if (curves.y)
                yIndex = curves.y.times.indexOf(time);
            if (curves.z)
                zIndex = curves.z.times.indexOf(time);
            if (xIndex !== -1) {
                const xValue = curves.x.values[xIndex];
                values.push(xValue);
                prevValue[0] = xValue;
            }
            else {
                values.push(prevValue[0]);
            }
            if (yIndex !== -1) {
                const yValue = curves.y.values[yIndex];
                values.push(yValue);
                prevValue[1] = yValue;
            }
            else {
                values.push(prevValue[1]);
            }
            if (zIndex !== -1) {
                const zValue = curves.z.values[zIndex];
                values.push(zValue);
                prevValue[2] = zValue;
            }
            else {
                values.push(prevValue[2]);
            }
        });
        const result = [];
        for (let i = 0; i < values.length; i += 3) {
            result.push(new core_1.Vector3(values[i], values[i + 1], values[i + 2]));
        }
        return result;
    }
    /**
     * Noramlizes times for all axis.
     */
    static _GetTimes(curves) {
        let times = [];
        // first join together the times for each axis, if defined
        if (curves.x !== undefined)
            times = times.concat(curves.x.times);
        if (curves.y !== undefined)
            times = times.concat(curves.y.times);
        if (curves.z !== undefined)
            times = times.concat(curves.z.times);
        times = times.sort((a, b) => {
            return a - b;
        });
        if (times.length > 1) {
            let targetIndex = 1;
            let lastValue = times[0];
            for (let i = 1; i < times.length; i++) {
                const currentValue = times[i];
                if (currentValue !== lastValue) {
                    times[targetIndex] = currentValue;
                    lastValue = currentValue;
                    targetIndex++;
                }
            }
            times = times.slice(0, targetIndex);
        }
        return times;
    }
    /**
     * Parses the animation staks.
     */
    static _ParseAnimationStacks(objects, connections, layersMap) {
        var _a;
        const rawClips = new Map();
        const stackNodes = objects.nodes("AnimationStack");
        for (const a of stackNodes) {
            const id = a.prop(0, "number");
            const children = (_a = connections.get(id)) === null || _a === void 0 ? void 0 : _a.children;
            if (!children) {
                continue;
            }
            const layers = layersMap.get(children[0].id);
            if (!layers) {
                continue;
            }
            rawClips.set(id, {
                layers,
                name: a.prop(1, "string"),
            });
        }
        return rawClips;
    }
    /**
     * Parses the animation layers.
     */
    static _ParseAnimationLayers(objects, connections, cachedModels, cachedSkeletons, curveNodesMap) {
        const layersMap = new Map();
        const animationLayerNodes = objects.nodes("AnimationLayer");
        for (const a of animationLayerNodes) {
            const id = a.prop(0, "number");
            const layerCurveNodes = [];
            const connection = connections.get(id);
            if (!(connection === null || connection === void 0 ? void 0 : connection.children.length)) {
                continue;
            }
            connection.children.forEach((c, index) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const curveNode = curveNodesMap.get(c.id);
                if (!curveNode) {
                    return;
                }
                if (!curveNode.curves.x && !curveNode.curves.y && !curveNode.curves.z) {
                    return;
                }
                if (!layerCurveNodes[index]) {
                    const modelId = connections
                        .get(c.id)
                        .parents.filter(function (parent) {
                        return parent.relationship !== undefined;
                    })[0].id;
                    if (modelId !== undefined) {
                        const model = objects
                            .nodes("Model")
                            .find((m) => m.prop(0, "number") === modelId);
                        if (!model) {
                            return;
                        }
                        const nodeId = model.prop(0, "number");
                        const modelName = model.prop(1, "string");
                        const modelRef = this._GetTargets(nodeId, cachedModels, cachedSkeletons)[0];
                        let transform = core_1.Matrix.Identity();
                        if (modelRef) {
                            if (modelRef instanceof core_1.Bone) {
                                transform = modelRef.getRestPose().clone();
                            }
                            else if (modelRef instanceof core_1.TransformNode) {
                                transform = modelRef._localMatrix.clone();
                            }
                        }
                        const propertiesNode = model.node("Properties70");
                        const properties = propertiesNode === null || propertiesNode === void 0 ? void 0 : propertiesNode.nodes("P");
                        let preRotation;
                        let postRotation;
                        if (properties === null || properties === void 0 ? void 0 : properties.length) {
                            const preRotationNode = properties.find((p) => p.prop(0, "string") === "PreRotation");
                            const postRotationNode = properties.find((p) => p.prop(0, "string") === "PostRotation");
                            if (preRotationNode) {
                                preRotation = new core_1.Vector3(core_1.Tools.ToRadians((_a = preRotationNode.prop(4, "number")) !== null && _a !== void 0 ? _a : 0), core_1.Tools.ToRadians((_b = preRotationNode.prop(5, "number")) !== null && _b !== void 0 ? _b : 0), core_1.Tools.ToRadians((_c = preRotationNode.prop(6, "number")) !== null && _c !== void 0 ? _c : 0));
                            }
                            if (postRotationNode) {
                                postRotation = new core_1.Vector3(core_1.Tools.ToRadians((_d = postRotationNode.prop(4, "number")) !== null && _d !== void 0 ? _d : 0), core_1.Tools.ToRadians((_e = postRotationNode.prop(5, "number")) !== null && _e !== void 0 ? _e : 0), core_1.Tools.ToRadians((_f = postRotationNode.prop(6, "number")) !== null && _f !== void 0 ? _f : 0));
                            }
                        }
                        const node = {
                            modelId,
                            transform,
                            modelName,
                            preRotation,
                            postRotation,
                            id: nodeId,
                            eulerOrder: (_j = (_h = (_g = modelRef === null || modelRef === void 0 ? void 0 : modelRef.metadata) === null || _g === void 0 ? void 0 : _g.transformData) === null || _h === void 0 ? void 0 : _h.eulerOrder) !== null && _j !== void 0 ? _j : "ZYX",
                        };
                        layerCurveNodes[index] = node;
                    }
                }
                if (layerCurveNodes[index]) {
                    //@ts-ignore
                    layerCurveNodes[index][curveNode.attrName] = curveNode;
                }
            });
            layersMap.set(id, layerCurveNodes);
        }
        return layersMap;
    }
    /**
     * Returns the list of all animation targets for the given id.
     */
    static _GetTargets(id, cachedModels, cachedSkeletons) {
        const target = cachedModels[id];
        if (target && target instanceof core_1.TransformNode) {
            return [target];
        }
        // Check shared bones
        const targets = [];
        for (const skeletonId in cachedSkeletons) {
            const skeleton = cachedSkeletons[skeletonId];
            const targetBone = skeleton.skeletonInstance.bones.find((b) => b.id === id.toString());
            if (targetBone) {
                targets.push(targetBone);
            }
        }
        return targets;
    }
    /**
     * Parses the animation curves.
     */
    static _ParseAnimationCurves(objects, connections, curveNodesMap) {
        var _a;
        const animationCurves = objects.nodes("AnimationCurve");
        for (const a of animationCurves) {
            const id = a.prop(0, "number");
            const animationCurve = {
                id,
                times: a
                    .node("KeyTime")
                    .prop(0, "number[]")
                    .map((t) => t / 46186158000),
                values: a.node("KeyValueFloat").prop(0, "number[]"),
            };
            const relationships = connections.get(animationCurve.id);
            if (!((_a = relationships === null || relationships === void 0 ? void 0 : relationships.parents) === null || _a === void 0 ? void 0 : _a[0].relationship)) {
                continue;
            }
            const animationCurveId = relationships.parents[0].id;
            const animationCurveRelationship = relationships.parents[0].relationship;
            const curveNode = curveNodesMap.get(animationCurveId);
            if (!curveNode) {
                continue;
            }
            if (animationCurveRelationship.match(/X/)) {
                curveNode.curves["x"] = animationCurve;
            }
            else if (animationCurveRelationship.match(/Y/)) {
                curveNode.curves["y"] = animationCurve;
            }
            else if (animationCurveRelationship.match(/Z/)) {
                curveNode.curves["z"] = animationCurve;
            }
            else if (animationCurveRelationship.match(/d|DeformPercent/) &&
                curveNodesMap.has(animationCurveId)) {
                curveNode.curves["morph"] = animationCurve;
            }
        }
    }
    /**
     * Prepares parsing the animation curves.
     */
    static _PrepareAnimationCurves(objects) {
        const map = new Map();
        const animationCurveNodes = objects.nodes("AnimationCurveNode");
        if (!animationCurveNodes.length) {
            return map;
        }
        animationCurveNodes.forEach((cvn) => {
            const attrName = cvn.prop(1, "string").replace("AnimCurveNode::", "");
            if (attrName.match(/S|R|T|DeformPercent/) !== null) {
                const id = cvn.prop(0, "number");
                map.set(id, { id, attrName, curves: {} });
            }
        });
        return map;
    }
}
exports.FBXAnimations = FBXAnimations;
//# sourceMappingURL=animations.js.map