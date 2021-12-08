import ts from "typescript";
import { Context, NodeParser } from "./NodeParser";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { setSourceFileNameIfDefinitionType } from "./Utils/setSourceFileNameIfDefinitionType";

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
            return new DefinitionType(this.fullName, baseType, sourceFileName);
        } else if (!this.topRef && baseType instanceof DefinitionType) {
            return setSourceFileNameIfDefinitionType(baseType.getType(), sourceFileName);
        } else {
            return setSourceFileNameIfDefinitionType(baseType, sourceFileName);
        }
    }
}
