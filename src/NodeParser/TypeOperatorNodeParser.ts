import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType, EnumValue } from "../Type/EnumType";
import { UnionType } from "../..";
import { LiteralType } from "../..";

export class TypeOperatorNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TypeOperatorNode): boolean {
        return node.kind === ts.SyntaxKind.TypeOperator;
    }

    public createType(node: ts.TypeOperatorNode, context: Context): BaseType {
        const type :any = this.typeChecker.getTypeFromTypeNode(node);
        // @ts-ignore

        /*

        */
        if(node.type && context.getArguments().length) {
            // @ts-ignore
            let p = context.getParameterProperties(node.type.typeName.text)
          //  if(context.getArguments().length > 1) {
                return new UnionType(
                    p.map((op) => {
                        return new LiteralType(op.name)
                    })
                )
            // } else {
            //     return new LiteralType(p[0].name)
            // }
        }  else {
            return new EnumType(
                `keyof-type-${node.getFullStart()}`,
                (type.types)? type.types.map((t: any) => t.value) : [type.value]
            );
        }

    }
}
