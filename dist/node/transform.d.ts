import { FBXReaderNode } from "fbx-parser";
import { TransformNode, Vector3, Bone } from "@babylonjs/core";
export interface IFBXTransformData {
    eulerOrder: string;
    inheritType?: number;
    scaling?: Vector3;
    preRotation?: Vector3;
    rotation?: Vector3;
    postRotation?: Vector3;
    translation?: Vector3;
}
export declare class FBXTransform {
    /**
     * Parses the transformation data of the given model.
     * @param model defines the reference to the model to parse its transformation data.
     * @param node defines the reference to the Model FBX node.
     */
    static ParseTransform(model: TransformNode | Bone, node: FBXReaderNode): void;
    /**
     * Applies the transformation data of the given model.
     * @param model defines the reference to the model to apply its transformation data.
     */
    static ApplyTransform(model: TransformNode | Bone): void;
    /**
     * Returns the transform data of the given model.
     * @param model defines the reference to the model to get its transform data.
     */
    static GetTransformData(model: TransformNode | Bone): IFBXTransformData;
}
