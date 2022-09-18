import { FBXReaderNode } from "fbx-parser";
export interface IFBXRelationShip {
    id: number;
    relationship?: string;
}
export interface IFBXConnections {
    parents: IFBXRelationShip[];
    children: IFBXRelationShip[];
}
export declare class FBXConnections {
    /**
     * Parses the given connections node to parse all relationships.
     * @param node defines the reference to the connections FBX node.
     * @returns the map containing all connections.
     */
    static ParseConnections(node: FBXReaderNode): Map<number, IFBXConnections>;
}
