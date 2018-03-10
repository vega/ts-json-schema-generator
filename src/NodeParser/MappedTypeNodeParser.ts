import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";

export class MappedTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.MappedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.MappedType;
    }

    public createType(node: ts.MappedTypeNode, context: Context): BaseType {
        return new ObjectType(
            `indexed-type-${node.getFullStart()}`,
            [],
            this.getProperties(node, context),
            false,
        );
    }

    private getObjectProperty(type: any, node: ts.MappedTypeNode, context: Context) {
        return new ObjectProperty(
            type.value,
            this.childNodeParser.createType(node.type!, context),
            !node.questionToken,
        );
    }

    private getProperties(node: ts.MappedTypeNode, context: Context): ObjectProperty[] {
        const type: any = this.typeChecker.getTypeFromTypeNode(node.typeParameter.constraint!);

        if (type.types) {
            return type.types.map((t: any) => this.getObjectProperty(t, node, context));
        } else if (type.intrinsicName !== "never") {
            return [this.getObjectProperty(type, node, context)];
        } else {
            return [];
        }
    }
}
