import { FBXReaderNode } from "fbx-parser";
import { Geometry, Scene } from "@babylonjs/core";
import { IFBXLoaderRuntime } from "../loader";
import { IFBXSkeleton } from "./skeleton";
export interface IFBXGeometryResult {
    geometry: Geometry;
    materialIndices?: number[];
}
export declare class FBXGeometry {
    /**
     * Parses all available geometries.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseGeometries(runtime: IFBXLoaderRuntime): void;
    /**
     * Imports the given Geometry node and returns its reference.
     * @param node defines the reference to the Geometry FBX node.
     * @param scene defines the reference to the scene where to add the geometry.
     * @param skeleton defines the optional reference to the skeleton linked to the geometry.
     * @returns the reference to the parsed geometry.
     */
    static Import(node: FBXReaderNode, scene: Scene, skeleton?: IFBXSkeleton, model?: FBXReaderNode): IFBXGeometryResult;
    /**
     * Normalizes the given skin weights buffer.
     */
    private static _NormalizeWeights;
    /**
     * Cleans the given weights and indices.
     */
    private static _CleanWeights;
    /**
     * Generates the final buffers.
     */
    private static _GenerateBuffers;
    /**
     * Generates a face according the to given face infos.
     */
    private static _GenerateFace;
    /**
     * Parses the given UVs FBX node and returns its parsed geometry data.
     */
    private static _ParseUvs;
    /**
     * Parses the given normals FBX node and returns its parsed geometry data.
     */
    private static _ParseNormals;
    /**
     * Parses the given materials FBX node and returns its parsed geometry data.
     */
    private static _ParseMaterials;
    /**
     * Returns the data associated to the given parsed geometry data.
     */
    private static _GetData;
    /**
     * Slices the given array.
     */
    private static _Slice;
}
