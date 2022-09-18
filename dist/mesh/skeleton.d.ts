import { FBXReaderNode } from "fbx-parser";
import { Matrix, Skeleton, Bone } from "@babylonjs/core";
import { IFBXLoaderRuntime } from "../loader";
import { IFBXConnections } from "../connections";
export interface IRawBone {
    id: number;
    indices: number[];
    weights: number[];
    transform: Matrix;
    transformLink: Matrix;
}
export interface IFBXSkeleton {
    id: number;
    bones: Bone[];
    rawBones: IRawBone[];
    skeletonInstance: Skeleton;
}
export declare class FBXSkeleton {
    /**
     * Parses the raw skeletons.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseRawSkeletons(runtime: IFBXLoaderRuntime): void;
    /**
     * Returns the parsed raw skeleton to be built later inline with the geometries.
     */
    private static _GetRawSkeleton;
    /**
     * Checks the given connections to compute bones.
     * @param runtime defines the reference to the current FBX runtime.
     * @param name defines the name of the bone.
     * @param connections defines the relationships of the FBX model node.
     * @returns the reference to the last bone created.
     */
    static CheckSkeleton(runtime: IFBXLoaderRuntime, model: FBXReaderNode, name: string, connections: IFBXConnections): void;
    /**
     * Binds the given skeletons to the associated meshes.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static BindSkeletons(runtime: IFBXLoaderRuntime): void;
}
