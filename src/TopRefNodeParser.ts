import ts from "typescript";
import { Context, NodeParser } from "./NodeParser.js";
import { BaseType } from "./Type/BaseType.js";
import { DefinitionType } from "./Type/DefinitionType.js";

export class TopRefNodeParser implements NodeParser {
    public constructor(
        protected childNodeParser: NodeParser,
        protected fullName: string | undefined,
        protected topRef: boolean
    ) {}

    public createType(node: ts.Node, context: Context): BaseType {
        const baseType = this.childNodeParser.createType(node, context);

        if (this.topRef && !(baseType instanceof DefinitionType)) {
            return new DefinitionType(this.fullName, baseType);
        } else if (!this.topRef && baseType instanceof DefinitionType) {
            return baseType.getType();
        } else {
            return baseType;
        }
    }
}
