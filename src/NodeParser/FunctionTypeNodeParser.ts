import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { FunctionType } from "../Type/FunctionType";
import { referenceHidden } from "../Utils/isHidden";

export class FunctionTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.FunctionTypeNode): boolean {
      return node.kind === ts.SyntaxKind.FunctionType;
    }

    public createType(node: ts.FunctionTypeNode, context: Context): BaseType {
      const hidden = referenceHidden(this.typeChecker);
      return new FunctionType(
            node.parameters
                .filter((item) => !hidden(item))
                .map((item) => {
                  if (item.type) {
                    return this.childNodeParser.createType(item.type, context);
                  }

                  throw new Error("FunctionTypeNodeParser: parameter does not have a type");
                }),
            this.childNodeParser.createType(node.type, context),
      );
    }
}
