import { Node } from "typescript";

export function nodeFilename(node: Node): string | undefined {
    if (!node.getSourceFile()) {
        return undefined;
    }

    return node.getSourceFile().fileName.substring(process.cwd().length + 1);
}
