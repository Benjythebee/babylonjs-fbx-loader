"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FBXConnections = void 0;
class FBXConnections {
    /**
     * Parses the given connections node to parse all relationships.
     * @param node defines the reference to the connections FBX node.
     * @returns the map containing all connections.
     */
    static ParseConnections(node) {
        const connections = node.nodes("C");
        const map = new Map();
        connections.forEach((c) => {
            var _a, _b;
            const childId = c.prop(1, "number");
            const parentId = c.prop(2, "number");
            const relationship = c.prop(3, "string");
            if (!map.has(childId)) {
                map.set(childId, { parents: [], children: [] });
            }
            (_a = map.get(childId)) === null || _a === void 0 ? void 0 : _a.parents.push({ id: parentId, relationship });
            if (!map.has(parentId)) {
                map.set(parentId, { parents: [], children: [] });
            }
            (_b = map.get(parentId)) === null || _b === void 0 ? void 0 : _b.children.push({ id: childId, relationship });
        });
        return map;
    }
}
exports.FBXConnections = FBXConnections;
//# sourceMappingURL=connections.js.map