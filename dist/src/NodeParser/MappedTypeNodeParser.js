"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const __1 = require("../..");
const NodeParser_1 = require("../NodeParser");
const ObjectType_1 = require("../Type/ObjectType");
const _ = require("lodash");
class MappedTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.MappedType;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(`indexed-type-${node.getFullStart()}`, [], this.getProperties(node, context), false);
    }
    getProperties(node, context) {
        if (context.hasParameters()) {
            let originalPropsTemp;
            if (node.type && node.type.objectType) {
                originalPropsTemp = context.getParameterProperties(node.type.objectType.typeName.text);
            }
            else if (node.type && node.type.typeArguments && node.type.typeName) {
                if (node.type.typeArguments.length == 2) {
                    if (node.typeParameter.constraint && node.typeParameter.constraint.type) {
                        let OriginalArg = _.cloneDeep(context.getArguments()[0]);
                        originalPropsTemp = context.getParameterProperties(node.typeParameter.constraint.type.typeName.text);
                        originalPropsTemp.forEach((props) => {
                            let subContext = new NodeParser_1.Context();
                            subContext.pushArgument(OriginalArg);
                            subContext.pushArgument(new __1.LiteralType(props.getName()));
                            node.type.typeArguments.forEach((typeArg) => {
                                subContext.pushParameter(typeArg.typeName.text);
                            });
                            props.setType(this.childNodeParser.createType(node.type, subContext));
                        });
                    }
                    else {
                        originalPropsTemp = context.getParameterProperties(node.typeParameter.constraint.typeName.text, false, this.childNodeParser.createType(node.type, context));
                    }
                }
            }
            else if (node.type && node.type.typeName) {
                originalPropsTemp = context.getParameterProperties(node.typeParameter.constraint.typeName.text);
            }
            else {
                originalPropsTemp = [];
            }
            const originalProps = originalPropsTemp;
            const toPick = (node.typeParameter && node.typeParameter.constraint &&
                node.typeParameter.constraint.typeName) ?
                context.getParameterProperties(node.typeParameter.constraint.typeName.text, true) :
                (node.typeParameter && node.typeParameter.constraint &&
                    node.typeParameter.constraint.type && node.typeParameter.constraint.type.typeName) ?
                    context.getParameterProperties(node.typeParameter.constraint.type.typeName.text, true) :
                    [];
            return originalProps.filter((p) => {
                return toPick.includes(p.name);
            }).map((p) => {
                p.required = !node.questionToken;
                return p;
            });
        }
        else {
            const type = this.typeChecker.getTypeFromTypeNode(node.typeParameter.constraint);
            if (type.types) {
                return type.types.reduce((result, t) => {
                    const createdType = this.childNodeParser.createType(node.type, context);
                    const objectProperty = new ObjectType_1.ObjectProperty(t.value, createdType, !node.questionToken);
                    result.push(objectProperty);
                    return result;
                }, []);
            }
        }
        return [];
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map