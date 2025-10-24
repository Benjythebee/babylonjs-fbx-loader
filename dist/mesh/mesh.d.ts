import { FBXReaderNode } from 'fbx-parser';
import { Mesh } from '@babylonjs/core';
import { IFBXLoaderRuntime } from '../loader';
import { IFBXConnections } from '../connections';
export declare class FBXMesh {
    /**
     * Creates the given mesh according to the given relationships.
     * @param runtime defines the reference to the current FBX runtime.
     * @param node defines the mesh FBX node.
     * @param connections defines the relationships of the FBX model node.
     * @returns the reference to the mesh created.
     */
    static CreateMesh(runtime: IFBXLoaderRuntime, node: FBXReaderNode, connections: IFBXConnections): Mesh;
}
