"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const path_1 = require("path");
const core_1 = require("@babylonjs/core");
class Tools {
    /**
     * Returns the name of the constructor of the given object.
     * @param object the object to return its constructor name.
     */
    static GetConstructorName(object) {
        let name = object && object.constructor ? object.constructor.name : "";
        if (name === "") {
            name = typeof object;
        }
        return name;
    }
    /**
     * Returns the metadatas of the given node.
     * @param node defines the reference to the node to get its metadatas.
     */
    static GetNodeMetadata(node) {
        var _a;
        node.metadata = (_a = node.metadata) !== null && _a !== void 0 ? _a : {};
        return node.metadata;
    }
    /**
     * Returns the metadatas of the given mesh.
     * @param mesh defines the reference to the mesh to get its metadatas.
     */
    static GetMeshMetadata(mesh) {
        return this.GetNodeMetadata(mesh);
    }
    /**
     * Returns the metadatas of the given transform node.
     * @param transformNode defines the reference to the transform node to get its metadatas.
     */
    static GetTransformNodeMetadata(transformNode) {
        return this.GetNodeMetadata(transformNode);
    }
    /**
     * Returns the metadatas of the given material.
     * @param material defines the reference to the material to get its metadatas.
     */
    static GetMaterialMetadata(material) {
        var _a;
        material.metadata = (_a = material.metadata) !== null && _a !== void 0 ? _a : {};
        return material.metadata;
    }
    /**
     * Returns the absolute path to the attached JS file or the given TS file.
     * @param workspaceDir defines the absolute path to the workspace.
     * @param relativePath defines the relative path of the TS file to get its JS source file path.
     * @returns the absolute path to the attached JS file.
     */
    static GetSourcePath(workspaceDir, relativePath) {
        const extension = (0, path_1.extname)(relativePath);
        const extensionIndex = relativePath.lastIndexOf(extension);
        if (extensionIndex === -1) {
            return "";
        }
        const jsName = (0, path_1.normalize)(`${relativePath.substr(0, extensionIndex)}.js`);
        return (0, path_1.join)(workspaceDir, "build", jsName);
    }
    /**
     * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
     * Be aware Math.random() could cause collisions, but:
     * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
     */
    static RandomId() {
        return core_1.Tools.RandomId();
    }
    /**
     * Returns all the scene nodes of the given scene.
     * @param scene the scene containing the nodes to get.
     */
    static getAllSceneNodes(scene) {
        return scene.meshes
            .concat(scene.lights)
            .concat(scene.cameras)
            .concat(scene.transformNodes);
    }
    /**
     * Returns wether or not the given element is a child (recursively) of the given parent.
     * @param element the element being possibily a child of the given parent.
     * @param parent the parent to check.
     */
    static IsElementChildOf(element, parent) {
        while (element.parentElement) {
            if (element === parent) {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }
    /**
     * Waits until the given timeMs value is reached.
     * @param timeMs the time in milliseconds to wait.
     */
    static Wait(timeMs) {
        return new Promise((resolve) => setTimeout(() => resolve(), timeMs));
    }
    /**
     * Waits for the next animation frame.
     */
    static WaitNextAnimationFrame() {
        return new Promise((resolve) => requestAnimationFrame(() => resolve()));
    }
    /**
     * Returns the given array by keeping only distinct values.
     * @param array the array to filter.
     */
    static Distinct(array) {
        const unique = (value, index, self) => self.indexOf(value) === index;
        return array.filter(unique);
    }
    /**
     * Sorts the given array alphabetically.
     * @param array defines the array containing the elements to sort alphabetically.
     * @param property in case of an array of objects, this property will be used to get the right value to sort.
     */
    static SortAlphabetically(array, property) {
        array.sort((a, b) => {
            a = property ? a[property] : a;
            b = property ? b[property] : b;
            a = a.toUpperCase();
            b = b.toUpperCase();
            return a < b ? -1 : a > b ? 1 : 0;
        });
        return array;
    }
    /**
     * Deeply clones the given object.
     * @param object the object reference to clone.
     * @warning take care of cycle dependencies!
     */
    static CloneObject(object) {
        if (!object) {
            return object;
        }
        return JSON.parse(JSON.stringify(object));
    }
    /**
     * Returns the property of the given object at the given path..
     * @param object defines the object reference containing the property to get.
     * @param path defines the path of the property to get;
     */
    static GetProperty(object, path) {
        const split = path.split(".");
        for (let i = 0; i < split.length; i++) {
            object = object[split[i]];
        }
        return object;
    }
    /**
     * Returns the effective property of the given object at the given path..
     * @param object defines the object reference containing the property to get.
     * @param path the path of the property to get.
     */
    static GetEffectiveProperty(object, path) {
        const split = path.split(".");
        for (let i = 0; i < split.length - 1; i++) {
            object = object[split[i]];
        }
        return object;
    }
    /**
     * Returns the saved editor preferences (zoom, etc.).
     */
    static GetEditorPreferences() {
        var _a;
        const settings = JSON.parse((_a = localStorage.getItem("babylonjs-editor-preferences")) !== null && _a !== void 0 ? _a : "{ }");
        return settings;
    }
    /**
     * Creates a screenshot of the current scene.
     * @param engine the engine used to render the scene to take as screenshot.
     * @param camera the camera that should be used for the screenshot.
     */
    static CreateScreenshot(engine, camera) {
        return __awaiter(this, void 0, void 0, function* () {
            return core_1.Tools.CreateScreenshotAsync(engine, camera, {
                width: 3840,
                height: 2160,
            }, "image/png");
        });
    }
    /**
     * Shows the open file dialog and returns the selected file.
     */
    static ShowNativeOpenFileDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this._ShowOpenFileDialog(false);
            return files[0];
        });
    }
    /**
     * Shows the open multiple files dialog and returns the selected files.
     */
    static ShowNativeOpenMultipleFileDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._ShowOpenFileDialog(true);
        });
    }
    /**
     * Shows the open file dialog.
     */
    static _ShowOpenFileDialog(multiple) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = multiple;
                input.addEventListener("change", () => {
                    var _a;
                    input.remove();
                    if ((_a = input.files) === null || _a === void 0 ? void 0 : _a.length) {
                        const files = [];
                        for (let i = 0; i < input.files.length; i++) {
                            files.push(input.files.item(i));
                        }
                        return resolve(files);
                    }
                    reject("User decided to not choose any files.");
                });
                input.click();
            });
        });
    }
    /**
     * Returns the extension attached to the given mime type.
     * @param mimeType the mitype to check.
     */
    static GetExtensionFromMimeType(mimeType) {
        switch (mimeType.toLowerCase()) {
            case "image/png":
                return ".png";
            case "image/jpg":
                return ".jpg";
            case "image/jpeg":
                return ".jpeg";
            case "image/bmp":
                return ".bmp";
            default:
                return ".png";
        }
    }
    /**
     * Reads the given file as array buffer.
     * @param file the file to read and return its content as array buffer.
     */
    static ReadFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            core_1.Tools.ReadFile(file, (d) => resolve(d), undefined, true, (err) => reject(err));
        });
    }
    /**
     * Loads a file from a url.
     * @param url the file url to load.
     * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer.
     * @param onProgress callback called while file is loading (if the server supports this mode).
     */
    static LoadFile(url, useArrayBuffer, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                core_1.Tools.LoadFile(url, (d) => resolve(d), onProgress, undefined, useArrayBuffer, (_, e) => reject(e));
            });
        });
    }
}
exports.Tools = Tools;
//# sourceMappingURL=tools.js.map