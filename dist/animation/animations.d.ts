import { IFBXLoaderRuntime } from "../loader";
export declare class FBXAnimations {
    /**
     * Creates the animation groups available in the FBX file, ignored if no clip defined.
     * @param runtime defines the reference to the current FBX runtime.
     */
    static ParseAnimationGroups(runtime: IFBXLoaderRuntime): void;
    /**
     * Creates the animation groups according to the given parsed clips.
     */
    private static _CreateAnimationGroups;
    /**
     * Adds the given clip to the animation group.
     */
    private static _AddClip;
    /**
     * Interpolates the given rotation curve.
     */
    private static _InterpolateRotations;
    /**
     * Returns the animationt's values as Vector3.
     */
    private static _GetKeyFrameAnimationValues;
    /**
     * Noramlizes times for all axis.
     */
    private static _GetTimes;
    /**
     * Parses the animation staks.
     */
    private static _ParseAnimationStacks;
    /**
     * Parses the animation layers.
     */
    private static _ParseAnimationLayers;
    /**
     * Returns the list of all animation targets for the given id.
     */
    private static _GetTargets;
    /**
     * Parses the animation curves.
     */
    private static _ParseAnimationCurves;
    /**
     * Prepares parsing the animation curves.
     */
    private static _PrepareAnimationCurves;
}
