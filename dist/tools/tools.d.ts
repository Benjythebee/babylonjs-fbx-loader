import { Engine, Scene, Node, Camera, Mesh, Material } from "@babylonjs/core";
import { ICommonMetadata, IEditorPreferences, IMaterialMetadata, IMeshMetadata, ITransformNodeMetadata } from "./types";
export declare class Tools {
    /**
     * Returns the name of the constructor of the given object.
     * @param object the object to return its constructor name.
     */
    static GetConstructorName(object: any): string;
    /**
     * Returns the metadatas of the given node.
     * @param node defines the reference to the node to get its metadatas.
     */
    static GetNodeMetadata(node: Node): ICommonMetadata;
    /**
     * Returns the metadatas of the given mesh.
     * @param mesh defines the reference to the mesh to get its metadatas.
     */
    static GetMeshMetadata(mesh: Mesh): IMeshMetadata;
    /**
     * Returns the metadatas of the given transform node.
     * @param transformNode defines the reference to the transform node to get its metadatas.
     */
    static GetTransformNodeMetadata(transformNode: Mesh): ITransformNodeMetadata;
    /**
     * Returns the metadatas of the given material.
     * @param material defines the reference to the material to get its metadatas.
     */
    static GetMaterialMetadata(material: Material): IMaterialMetadata;
    /**
     * Returns the absolute path to the attached JS file or the given TS file.
     * @param workspaceDir defines the absolute path to the workspace.
     * @param relativePath defines the relative path of the TS file to get its JS source file path.
     * @returns the absolute path to the attached JS file.
     */
    static GetSourcePath(workspaceDir: string, relativePath: string): string;
    /**
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     */
    static RandomId(): string;
    /**
     * Returns all the scene nodes of the given scene.
     * @param scene the scene containing the nodes to get.
     */
    static getAllSceneNodes(scene: Scene): Node[];
    /**
     * Returns wether or not the given element is a child (recursively) of the given parent.
     * @param element the element being possibily a child of the given parent.
     * @param parent the parent to check.
     */
    static IsElementChildOf(element: HTMLElement, parent: HTMLElement): boolean;
    /**
     * Waits until the given timeMs value is reached.
     * @param timeMs the time in milliseconds to wait.
     */
    static Wait(timeMs: number): Promise<void>;
    /**
     * Waits for the next animation frame.
     */
    static WaitNextAnimationFrame(): Promise<void>;
    /**
     * Returns the given array by keeping only distinct values.
     * @param array the array to filter.
     */
    static Distinct<T>(array: T[]): T[];
    /**
     * Sorts the given array alphabetically.
     * @param array defines the array containing the elements to sort alphabetically.
     * @param property in case of an array of objects, this property will be used to get the right value to sort.
     */
    static SortAlphabetically(array: any[], property?: string): any[];
    /**
     * Deeply clones the given object.
     * @param object the object reference to clone.
     * @warning take care of cycle dependencies!
     */
    static CloneObject<T>(object: T): T;
    /**
     * Returns the property of the given object at the given path..
     * @param object defines the object reference containing the property to get.
     * @param path defines the path of the property to get;
     */
    static GetProperty<T>(object: any, path: string): T;
    /**
     * Returns the effective property of the given object at the given path..
     * @param object defines the object reference containing the property to get.
     * @param path the path of the property to get.
     */
    static GetEffectiveProperty<T>(object: any, path: string): T;
    /**
     * Returns the saved editor preferences (zoom, etc.).
     */
    static GetEditorPreferences(): IEditorPreferences;
    /**
     * Creates a screenshot of the current scene.
     * @param engine the engine used to render the scene to take as screenshot.
     * @param camera the camera that should be used for the screenshot.
     */
    static CreateScreenshot(engine: Engine, camera: Camera): Promise<string>;
    /**
     * Shows the open file dialog and returns the selected file.
     */
    static ShowNativeOpenFileDialog(): Promise<File>;
    /**
     * Shows the open multiple files dialog and returns the selected files.
     */
    static ShowNativeOpenMultipleFileDialog(): Promise<File[]>;
    /**
     * Shows the open file dialog.
     */
    private static _ShowOpenFileDialog;
    /**
     * Returns the extension attached to the given mime type.
     * @param mimeType the mitype to check.
     */
    static GetExtensionFromMimeType(mimeType: string): string;
    /**
     * Reads the given file as array buffer.
     * @param file the file to read and return its content as array buffer.
     */
    static ReadFileAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer>;
    /**
     * Loads a file from a url.
     * @param url the file url to load.
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer.
     * @param onProgress callback called while file is loading (if the server supports this mode).
     */
    static LoadFile<T = string | ArrayBuffer>(url: string, useArrayBuffer: boolean, onProgress?: (data: any) => void): Promise<T>;
}
