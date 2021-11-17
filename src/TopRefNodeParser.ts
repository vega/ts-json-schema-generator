import ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";

export class TopRefNodeParser implements NodeParser {
    public constructor(
        private childNodeParser: NodeParser,
        private fullName: string | undefined,
        private topRef: boolean
    ) {}

    public createType(node: ts.Node, context: Context): BaseType | undefined {
        const baseType = this.childNodeParser.createType(node, context);
        const sourceFileName = node.getSourceFile().fileName;

        if (baseType === undefined) {
            return undefined;
        }

        if (this.topRef && !(baseType instanceof DefinitionType)) {
            const defBaseType = new DefinitionType(this.fullName, baseType);
            defBaseType.sourceFileName = sourceFileName;
            return defBaseType;
        } else if (!this.topRef && baseType instanceof DefinitionType) {
            const base = baseType.getType();
            base.sourceFileName = sourceFileName;
            return base;
        } else {
            baseType.sourceFileName = sourceFileName;
            return baseType;
        }
    }
}
