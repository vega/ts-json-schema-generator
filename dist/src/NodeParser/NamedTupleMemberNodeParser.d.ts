import ts from "typescript";
import type { Context, NodeParser } from "../NodeParser.js";
import type { SubNodeParser } from "../SubNodeParser.js";
import type { BaseType } from "../Type/BaseType.js";
import type { ReferenceType } from "../Type/ReferenceType.js";
export declare class NamedTupleMemberNodeParser implements SubNodeParser {
    protected childNodeParser: NodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.TypeNode): boolean;
    createType(node: ts.NamedTupleMember, context: Context, reference?: ReferenceType): BaseType;
}
