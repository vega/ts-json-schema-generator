import * as ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";

export class TopRefNodeParser implements NodeParser {
    public constructor(
        private childNodeParser: NodeParser,
        private fullName: string | undefined,
        private topRef: boolean,
    ) {
    }

    public createType(node: ts.Node, context: Context): BaseType {
        const baseType = this.childNodeParser.createType(node, context);
        if (this.topRef && !(baseType instanceof DefinitionType)) {
            return new DefinitionType(this.fullName, baseType);
        } else if (!this.topRef && (baseType instanceof DefinitionType)) {
            return baseType.getType();
        } else {
            return baseType;
        }
    }
}
