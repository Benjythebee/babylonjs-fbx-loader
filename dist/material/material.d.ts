import { IFBXLoaderRuntime } from '../loader';
export declare class FBXMaterial {
    private static _SupportedTextureTypes;
    /**
     * Parses all available materials in the FBX file.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseMaterials(runtime: IFBXLoaderRuntime): void;
    /**
     * Configures all the given textures.
     */
    private static _ParseTextures;
    /**
     * Parses all the available Video FBX nodes and returns the created textures dictionary.
     */
    private static _ParseVideos;
}
