"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXUtils = void 0;
const core_1 = require("@babylonjs/core");
class FBXUtils {
    /**
     * Applies the euler angles to the given rotation quaternion.
     * @param rotation defines the reference to the rotation quaternion.
     * @returns the reference to the result quaternion.
     */
    static GetFinalRotationQuaternion(rotation) {
        const r = rotation.toEulerAngles();
        return this.GetFinalRotationQuaternionFromVector(r);
    }
    /**
     * Applies the euler angles to the given rotation quaternion.
     * @param rotation defines the reference to the rotation vector.
     * @returns the reference to the result quaternion.
     */
    static GetFinalRotationQuaternionFromVector(rotation) {
        const x = core_1.Quaternion.RotationAxis(core_1.Vector3.Left(), rotation.x);
        const y = core_1.Quaternion.RotationAxis(core_1.Vector3.Up(), rotation.y);
        const z = core_1.Quaternion.RotationAxis(core_1.Vector3.Forward(), rotation.z);
        const q = core_1.Quaternion.Inverse(x.multiply(y).multiply(z));
        return q;
    }
    /**
     * Applies the euler angles to the given matrix and applies translation.
     * @param matrix defines the reference to the matrix to configure.
     * @returns the reference to the new matrix configured.
     */
    static GetMatrix(matrix, transformData) {
        const scale = core_1.Vector3.Zero();
        const rotation = core_1.Quaternion.Identity();
        const translation = core_1.Vector3.Zero();
        matrix.decompose(scale, rotation, translation);
        translation.x = -translation.x;
        let finalRotation = FBXUtils.GetFinalRotationQuaternion(rotation);
        if (transformData.preRotation) {
            const pre = FBXUtils.GetFinalRotationQuaternionFromVector(transformData.preRotation);
            finalRotation = pre.multiply(finalRotation);
        }
        if (transformData.postRotation) {
            const post = FBXUtils.GetFinalRotationQuaternionFromVector(transformData.postRotation);
            finalRotation = finalRotation.multiply(core_1.Quaternion.Inverse(post));
        }
        return core_1.Matrix.Compose(scale, finalRotation.normalize(), translation);
    }
}
exports.FBXUtils = FBXUtils;
//# sourceMappingURL=utils.js.map