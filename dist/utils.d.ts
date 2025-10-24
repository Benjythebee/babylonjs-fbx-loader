import { Matrix, Quaternion, Vector3 } from '@babylonjs/core';
import { IFBXTransformData } from './node/transform';
export declare class FBXUtils {
    /**
     * Applies the euler angles to the given rotation quaternion.
     * @param rotation defines the reference to the rotation quaternion.
     * @returns the reference to the result quaternion.
     */
    static GetFinalRotationQuaternion(rotation: Quaternion): Quaternion;
    /**
     * Applies the euler angles to the given rotation quaternion.
     * @param rotation defines the reference to the rotation vector.
     * @returns the reference to the result quaternion.
     */
    static GetFinalRotationQuaternionFromVector(rotation: Vector3): Quaternion;
    /**
     * Applies the euler angles to the given matrix and applies translation.
     * @param matrix defines the reference to the matrix to configure.
     * @returns the reference to the new matrix configured.
     */
    static GetMatrix(matrix: Matrix, transformData: IFBXTransformData): Matrix;
}
