import { DefinitionType } from "../Type/DefinitionType";

/**
 * Given a set of paths, will strip the common-prefix, and return an array of remaining substrings.
 * Also removes any file extensions, and replaces any '/' with '-' in the path.
 * Each return value can be used as a name prefix for disambiguation.
 * The returned prefixes array maintains input order.
 */
function getCommonPrefixes(paths: string[]) {
    // clone before sorting to maintain input order.
    const sorted = [...paths].sort();
    const shortest = sorted[0];
    const second = sorted[sorted.length - 1];
    const maxPrefix = shortest.length;
    let pos = 0;
    let path_pos = 0;
    while (pos < maxPrefix && shortest.charAt(pos) === second.charAt(pos)) {
        if (shortest.charAt(pos) === "/") {
            path_pos = pos;
        }
        pos++;
    }
    return paths.map((p) =>
        p
            .substr(path_pos + 1)
            .replace(/\//g, "__")
            .replace(/\.[^.]+$/, "")
    );
}

export function unambiguousName(child: DefinitionType, isRoot: boolean, peers: DefinitionType[]): string {
    if (peers.length === 1 || isRoot) {
        return child.getName();
    } else if (child.getType().getSrcFileName()) {
        let index = -1;

        // filter unique peers to be those that have srcFileNames.
        // Intermediate Types - AnnotationTypes, UnionTypes, do not have sourceFileNames
        const uniques = peers.filter((peer) => peer.getType().getSrcFileName());
        if (uniques.length === 1) {
            return uniques[0].getName();
        }
        const srcPaths = uniques.map((peer: DefinitionType, count) => {
            index = child === peer ? count : index;
            return peer.getType().getSrcFileName()!;
        });
        const prefixes = getCommonPrefixes(srcPaths);
        return `${prefixes[index]}-${child.getName()}`;
    } else {
        // intermediate type.
        const name = child.getName();
        // TODO: Perhaps we should maintain a name-id map, and throw a duplicate error on collision.
        if (name === undefined) {
            // this might be unreachable code.
            throw new Error(`Unable to disambiguate types`);
        }
        return name;
    }
}
