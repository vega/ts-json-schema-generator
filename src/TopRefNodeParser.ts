import ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { setSourceFileNameIfDefinitionType } from "./Utils/setSourceFileNameIfDefinitionType";

export class TopRefNodeParser implements NodeParser {
    public constructor(
        protected childNodeParser: NodeParser,
        protected fullName: string | undefined,
        protected topRef: boolean
    ) {}

    public createType(node: ts.Node, context: Context): BaseType {
        const baseType = this.childNodeParser.createType(node, context);
        const sourceFileName = node.getSourceFile().fileName;

        if (this.topRef && !(baseType instanceof DefinitionType)) {
            return new DefinitionType(this.fullName, baseType, sourceFileName);
        } else if (!this.topRef && baseType instanceof DefinitionType) {
            return setSourceFileNameIfDefinitionType(baseType.getType(), sourceFileName);
        } else {
            return setSourceFileNameIfDefinitionType(baseType, sourceFileName);
        }
    }
}
