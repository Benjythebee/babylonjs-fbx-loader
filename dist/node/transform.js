"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXTransform = void 0;
const core_1 = require("@babylonjs/core");
const utils_1 = require("../utils");
class FBXTransform {
    /**
     * Parses the transformation data of the given model.
     * @param model defines the reference to the model to parse its transformation data.
     * @param node defines the reference to the Model FBX node.
     */
    static ParseTransform(model, node) {
        var _a;
        // Apply transforms
        const propertiesNode = node.node("Properties70");
        if (propertiesNode) {
            const transformData = {
                eulerOrder: "ZYX",
            };
            const properties = propertiesNode.nodes("P");
            properties.forEach((p) => {
                var _a, _b, _c, _d;
                const type = p.prop(0, "string");
                const x = (_a = p.prop(4, "number")) !== null && _a !== void 0 ? _a : 0;
                const y = (_b = p.prop(5, "number")) !== null && _b !== void 0 ? _b : 0;
                const z = (_c = p.prop(6, "number")) !== null && _c !== void 0 ? _c : 0;
                switch (type) {
                    case "RotationOrder":
                        transformData.eulerOrder =
                            (_d = p.prop(4, "string")) !== null && _d !== void 0 ? _d : transformData.eulerOrder;
                        break;
                    case "InheritType":
                        transformData.inheritType = p.prop(4, "number");
                        break;
                    case "Lcl Translation":
                        transformData.translation = new core_1.Vector3(-x, y, z);
                        break;
                    case "PreRotation":
                        transformData.preRotation = new core_1.Vector3(core_1.Tools.ToRadians(x), core_1.Tools.ToRadians(y), core_1.Tools.ToRadians(z));
                        break;
                    case "Lcl Rotation":
                        transformData.rotation = new core_1.Vector3(core_1.Tools.ToRadians(x), core_1.Tools.ToRadians(y), core_1.Tools.ToRadians(z));
                        break;
                    case "PostRotation":
                        transformData.postRotation = new core_1.Vector3(core_1.Tools.ToRadians(x), core_1.Tools.ToRadians(y), core_1.Tools.ToRadians(z));
                        break;
                    case "RotationOffset":
                        // TODO.
                        break;
                    case "RotationPivot":
                        // TODO.
                        break;
                    case "Lcl Scaling":
                        transformData.scaling = new core_1.Vector3(x, y, z);
                        break;
                    case "ScalingOffset":
                        // TODO.
                        break;
                    case "ScalingPivot":
                        // TODO.
                        break;
                }
            });
            (_a = model.metadata) !== null && _a !== void 0 ? _a : (model.metadata = {});
            model.metadata.transformData = transformData;
        }
    }
    /**
     * Applies the transformation data of the given model.
     * @param model defines the reference to the model to apply its transformation data.
     */
    static ApplyTransform(model) {
        var _a, _b, _c;
        const transformData = (_a = model.metadata) === null || _a === void 0 ? void 0 : _a.transformData;
        if (!transformData) {
            return;
        }
        const scaling = (_b = transformData.scaling) !== null && _b !== void 0 ? _b : model.scaling;
        const translation = (_c = transformData.translation) !== null && _c !== void 0 ? _c : model.position;
        let finalRotation = core_1.Quaternion.Identity();
        if (transformData.rotation) {
            finalRotation = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(transformData.rotation);
        }
        if (transformData.preRotation) {
            const pre = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(transformData.preRotation);
            finalRotation = pre.multiply(finalRotation);
        }
        if (transformData.postRotation) {
            const post = utils_1.FBXUtils.GetFinalRotationQuaternionFromVector(transformData.postRotation);
            finalRotation = finalRotation.multiply(core_1.Quaternion.Inverse(post));
        }
        // if (!model.parent) {
        // 	finalRotation = FBXUtils.GetFinalRotationQuaternion(finalRotation);
        // } else {
        // 	finalRotation.x = -finalRotation.x;
        // 	finalRotation.w = -finalRotation.w;
        // }
        // Set
        model.scaling = scaling;
        model.position = translation;
        model.rotationQuaternion = finalRotation;
        delete model.metadata.transformData;
    }
    /**
     * Returns the transform data of the given model.
     * @param model defines the reference to the model to get its transform data.
     */
    static GetTransformData(model) {
        var _a;
        const transformData = (_a = model.metadata) === null || _a === void 0 ? void 0 : _a.transformData;
        if (!transformData) {
            return {
                eulerOrder: "ZYX",
            };
        }
        return transformData;
    }
}
exports.FBXTransform = FBXTransform;
//# sourceMappingURL=transform.js.map