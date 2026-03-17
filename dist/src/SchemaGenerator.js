"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaGenerator = void 0;
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const CircularReferenceTypeFormatter_js_1 = require("./CircularReferenceTypeFormatter.js");
const Errors_js_1 = require("./Error/Errors.js");
const NodeParser_js_1 = require("./NodeParser.js");
const DefinitionType_js_1 = require("./Type/DefinitionType.js");
const AnnotatedType_js_1 = require("./Type/AnnotatedType.js");
const hasJsDocTag_js_1 = require("./Utils/hasJsDocTag.js");
const removeUnreachable_js_1 = require("./Utils/removeUnreachable.js");
const replaceCircularRefs_js_1 = require("./Utils/replaceCircularRefs.js");
const castArray_js_1 = require("./Utils/castArray.js");
const symbolAtNode_js_1 = require("./Utils/symbolAtNode.js");
class SchemaGenerator {
    program;
    nodeParser;
    typeFormatter;
    config;
    constructor(program, nodeParser, typeFormatter, config) {
        this.program = program;
        this.nodeParser = nodeParser;
        this.typeFormatter = typeFormatter;
        this.config = config;
    }
    createSchema(fullNames) {
        const rootNodes = this.getRootNodes((0, castArray_js_1.castArray)(fullNames));
        return this.createSchemaFromNodes(rootNodes);
    }
    createSchemaFromNodes(rootNodes) {
        const roots = rootNodes.map((rootNode) => ({
            rootNode: rootNode,
            rootType: this.nodeParser.createType(rootNode, new NodeParser_js_1.Context()),
        }));
        const definitions = {};
        for (const root of roots) {
            try {
                this.appendRootChildDefinitions(root.rootType, definitions);
            }
            catch (error) {
                throw Errors_js_1.UnhandledError.from("Unhandled error while appending Child Type Definition.", root.rootNode, error);
            }
        }
        if (this.typeFormatter instanceof CircularReferenceTypeFormatter_js_1.CircularReferenceTypeFormatter) {
            this.typeFormatter.recomputeCachedDefinitions({ definitions });
        }
        const rootTypeDefinitions = roots.map((root) => this.getRootTypeDefinition(root.rootType, root.rootNode, definitions));
        (0, replaceCircularRefs_js_1.replaceCircularRefs)(definitions, rootTypeDefinitions);
        const rootTypeDefinition = rootTypeDefinitions.length === 1 ? rootTypeDefinitions[0] : undefined;
        const reachableDefinitions = rootTypeDefinitions.reduce((acc, def) => Object.assign(acc, (0, removeUnreachable_js_1.removeUnreachable)(def, definitions)), {});
        const { objToName, arrayToName } = (0, replaceCircularRefs_js_1.buildNameMaps)(reachableDefinitions);
        const clonedDefinitions = {};
        for (const [key, def] of Object.entries(reachableDefinitions)) {
            clonedDefinitions[key] = (0, replaceCircularRefs_js_1.deepCloneDefinition)(def, objToName, arrayToName);
        }
        return {
            ...(this.config?.schemaId ? { $id: this.config.schemaId } : {}),
            $schema: "http://json-schema.org/draft-07/schema#",
            ...(rootTypeDefinition ? (0, replaceCircularRefs_js_1.deepCloneDefinition)(rootTypeDefinition, objToName, arrayToName) : {}),
            definitions: clonedDefinitions,
        };
    }
    getRootNodes(fullNames) {
        // ["*"] means generate everything.
        if (fullNames && fullNames.includes("*") && fullNames.length > 1) {
            throw new Error("Cannot mix '*' with specific type names");
        }
        const generateAll = !fullNames || fullNames.length === 0 || (fullNames.length === 1 && fullNames[0] === "*");
        if (!generateAll) {
            return fullNames.map((name) => this.findNamedNode(name));
        }
        const rootFileNames = this.program.getRootFileNames();
        const rootSourceFiles = this.program
            .getSourceFiles()
            .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));
        const rootNodes = new Map();
        this.appendTypes(rootSourceFiles, this.program.getTypeChecker(), rootNodes);
        return [...rootNodes.values()];
    }
    findNamedNode(fullName) {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map();
        const { projectFiles, externalFiles } = this.partitionFiles();
        this.appendTypes(projectFiles, typeChecker, allTypes);
        if (allTypes.has(fullName)) {
            return allTypes.get(fullName);
        }
        this.appendTypes(externalFiles, typeChecker, allTypes);
        if (allTypes.has(fullName)) {
            return allTypes.get(fullName);
        }
        throw new Errors_js_1.RootlessError(fullName);
    }
    getRootTypeDefinition(rootType, rootNode, definitions) {
        try {
            return this.typeFormatter.getDefinition(rootType, { definitions });
        }
        catch (error) {
            throw Errors_js_1.UnhandledError.from("Unhandled error while creating Root Type Definition.", rootNode, error);
        }
    }
    appendRootChildDefinitions(rootType, childDefinitions) {
        const seen = new Set();
        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child) => child instanceof DefinitionType_js_1.DefinitionType)
            .filter((child) => {
            if (!seen.has(child.getId())) {
                seen.add(child.getId());
                return true;
            }
            return false;
        });
        const ids = new Map();
        const baseIds = new Map();
        for (const child of children) {
            const name = child.getName();
            const previousId = ids.get(name);
            // Strip def- prefixes from IDs. DefinitionType.getId() returns "def-{innerType.getId()}"
            // and for generic types, nested DefinitionTypes also add def- prefixes. Stripping all
            // of them normalizes the comparison for types that may be wrapped differently.
            const childId = child.getId().replace(/def-/g, "");
            // Also track the base type ID (without AnnotatedType wrapper) to handle cases where
            // the same type appears with different annotations (e.g., a discriminated union type
            // referenced directly vs from a property - one has @discriminator annotation, one doesn't)
            const innerType = child.getType();
            const baseChildId = (innerType instanceof AnnotatedType_js_1.AnnotatedType ? innerType.getType() : innerType).getId();
            const previousBaseId = baseIds.get(name);
            if (previousId && childId !== previousId) {
                // Check if the base type (without annotations) matches - if so, it's just
                // annotation differences, not truly different types
                if (previousBaseId === baseChildId) {
                    continue;
                }
                throw new Errors_js_1.MultipleDefinitionsError(name, child, children.find((c) => c.getId().replace(/def-/g, "") === previousId));
            }
            ids.set(name, childId);
            baseIds.set(name, baseChildId);
        }
        children.reduce((definitions, child) => {
            const name = child.getName();
            if (!(name in definitions)) {
                definitions[name] = this.typeFormatter.getDefinition(child.getType());
            }
            return definitions;
        }, childDefinitions);
    }
    partitionFiles() {
        const projectFiles = new Array();
        const externalFiles = new Array();
        for (const sourceFile of this.program.getSourceFiles()) {
            const destination = sourceFile.fileName.includes("/node_modules/") ? externalFiles : projectFiles;
            destination.push(sourceFile);
        }
        return { projectFiles, externalFiles };
    }
    appendTypes(sourceFiles, typeChecker, types) {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types);
        }
    }
    inspectNode(node, typeChecker, allTypes) {
        if (typescript_1.default.isVariableDeclaration(node)) {
            if (node.initializer?.kind === typescript_1.default.SyntaxKind.ArrowFunction ||
                node.initializer?.kind === typescript_1.default.SyntaxKind.FunctionExpression) {
                this.inspectNode(node.initializer, typeChecker, allTypes);
            }
            return;
        }
        if (typescript_1.default.isInterfaceDeclaration(node) ||
            typescript_1.default.isClassDeclaration(node) ||
            typescript_1.default.isEnumDeclaration(node) ||
            typescript_1.default.isTypeAliasDeclaration(node)) {
            if ((this.config?.expose === "all" || this.isExportType(node)) &&
                !this.isGenericType(node)) {
                allTypes.set(this.getFullName(node, typeChecker), node);
                return;
            }
            return;
        }
        if (typescript_1.default.isFunctionDeclaration(node) ||
            typescript_1.default.isFunctionExpression(node) ||
            typescript_1.default.isArrowFunction(node) ||
            typescript_1.default.isConstructorTypeNode(node)) {
            allTypes.set(this.getFullName(node, typeChecker), node);
            return;
        }
        if (typescript_1.default.isExportSpecifier(node)) {
            const symbol = typeChecker.getExportSpecifierLocalTargetSymbol(node);
            if (symbol?.declarations?.length === 1) {
                const declaration = symbol.declarations[0];
                if (typescript_1.default.isImportSpecifier(declaration)) {
                    // Handling the `Foo` in `import { Foo } from "./lib"; export { Foo };`
                    const type = typeChecker.getTypeAtLocation(declaration);
                    if (type.symbol?.declarations?.length === 1) {
                        this.inspectNode(type.symbol.declarations[0], typeChecker, allTypes);
                    }
                }
                else {
                    // Handling the `Bar` in `export { Bar } from './lib';`
                    this.inspectNode(declaration, typeChecker, allTypes);
                }
            }
            return;
        }
        if (typescript_1.default.isExportDeclaration(node)) {
            if (!typescript_1.default.isExportDeclaration(node)) {
                return;
            }
            if (node.exportClause) {
                // export { Foo } from './lib' or export { Foo };
                // export * as Foo from './lib' should not import all exports
                typescript_1.default.forEachChild(node.exportClause, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
                return;
            }
            if (!node.moduleSpecifier) {
                return;
            }
            // export * from './lib'
            const symbol = typeChecker.getSymbolAtLocation(node.moduleSpecifier);
            // should never hit this (maybe type error in user's code)
            if (!symbol || !symbol.declarations) {
                return;
            }
            // module augmentation can result in more than one source file
            for (const source of symbol.declarations) {
                const sourceSymbol = typeChecker.getSymbolAtLocation(source);
                if (!sourceSymbol) {
                    return;
                }
                const moduleExports = typeChecker.getExportsOfModule(sourceSymbol);
                for (const moduleExport of moduleExports) {
                    const nodes = moduleExport.declarations ||
                        (!!moduleExport.valueDeclaration && [moduleExport.valueDeclaration]);
                    // should never hit this (maybe type error in user's code)
                    if (!nodes) {
                        return;
                    }
                    for (const subnodes of nodes) {
                        this.inspectNode(subnodes, typeChecker, allTypes);
                    }
                }
            }
            return;
        }
        typescript_1.default.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
    }
    isExportType(node) {
        if (this.config?.jsDoc !== "none" && (0, hasJsDocTag_js_1.hasJsDocTag)(node, "internal")) {
            return false;
        }
        //@ts-expect-error - internal typescript API
        return !!node.localSymbol?.exportSymbol;
    }
    isGenericType(node) {
        return !!(node.typeParameters && node.typeParameters.length > 0);
    }
    getFullName(node, typeChecker) {
        return typeChecker.getFullyQualifiedName((0, symbolAtNode_js_1.symbolAtNode)(node)).replace(/".*"\./, "");
    }
}
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map