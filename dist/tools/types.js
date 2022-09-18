"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPlayMode = void 0;
var EditorPlayMode;
(function (EditorPlayMode) {
    /**
     * Opens the game in a new panel of the Editor.
     */
    EditorPlayMode[EditorPlayMode["EditorPanelBrowser"] = 0] = "EditorPanelBrowser";
    /**
     * Opens the game in a new window using the integrated browser.
     */
    EditorPlayMode[EditorPlayMode["IntegratedBrowser"] = 1] = "IntegratedBrowser";
    /**
     * Opens the game in an external browser (see user's prefs).
     */
    EditorPlayMode[EditorPlayMode["ExternalBrowser"] = 2] = "ExternalBrowser";
})(EditorPlayMode = exports.EditorPlayMode || (exports.EditorPlayMode = {}));
//# sourceMappingURL=types.js.map