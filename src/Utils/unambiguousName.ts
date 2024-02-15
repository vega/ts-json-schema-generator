import { DefinitionType } from "../Type/DefinitionType";

/**
 * Identifies the longest prefix common to all inputs and returns it.
 */
function longestCommonPrefix(inputs: string[]): string {
    let prefix = inputs.reduce((acc, str) => str.length < acc.length ? str : acc);

    for (let str of inputs) {
        while (str.slice(0, prefix.length) != prefix) {
            prefix = prefix.slice(0, -1);
        }
    }

    return prefix;
}

/**
 * Returns an unambiguous name for the given definition.
 *
 * If the definition's name doesn't cause conflicts, its behavior is identical to getName().
 * Otherwise, it uses the definition's file name to generate an unambiguous name.
 */
export function unambiguousName(child: DefinitionType, isRoot: boolean, peers: DefinitionType[]): string {
    // Root definitions or unambiguous ones get to keep their name.
    if (peers.length === 1 || isRoot) {
        return child.getName();
    }

    // "intermediate" type
    if (!child.getType().getSrcFileName()) {
        return child.getName();
    }

    // filter peers to keep only those who have file names.
    // Intermediate Types - AnnotationTypes, UnionTypes, do not have file names
    const sourcedPeers = peers.filter(peer => peer.getType().getSrcFileName());
    if (sourcedPeers.length === 1) {
        return sourcedPeers[0].getName();
    }

    let pathIndex = -1;
    const srcPaths = sourcedPeers.map((peer, count) => {
        pathIndex = child === peer ? count : pathIndex;
        return peer.getType().getSrcFileName()!;
    });

    const commonPrefixLength = longestCommonPrefix(srcPaths).length;

    // the definition and its peers actually seem to refer to the same thing
    if (commonPrefixLength == srcPaths[pathIndex].length) {
        return child.getName();
    }

    const uniquePath = srcPaths[pathIndex]
        .substring(commonPrefixLength) // remove the common prefix
        .replace(/\//g, "__")          // replace "/" by double underscores
        .replace(/\.[^.]+$/, "");      // strip the extension

    return `${uniquePath}-${child.getName()}`;
}
