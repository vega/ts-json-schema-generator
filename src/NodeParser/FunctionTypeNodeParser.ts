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

      const visibleParams = node.parameters.filter((item) => !hidden(item));

      const argumentOrder = visibleParams.map(item => (item as any).symbol.escapedName);
      const argumentTypes: { [key: string]: BaseType } = node.parameters
        .filter((item) => !hidden(item))
        .reduce((map: { [key: string]: BaseType }, item: ts.ParameterDeclaration) => {
          if (item.type) {
            map[(item as any).symbol.escapedName] = this.childNodeParser.createType(item.type, context);
            return map;
          }

          throw new Error("FunctionTypeNodeParser: parameter does not have a type");
        }, {});

      return new FunctionType(
          argumentOrder,
          argumentTypes,
          this.childNodeParser.createType(node.type, context),
      );
    }
}
