import type { Definition } from "../Schema/Definition.js";
import type { BaseType } from "../Type/BaseType.js";
import type { TypeFormatter } from "../TypeFormatter.js";
import type { GetDefinitionOptions } from "../TypeFormatter.js";
export type RefResolver = (ref: string) => Definition | undefined;
export declare function refResolverFromDefinitions(definitions?: Record<string, Definition>): RefResolver | undefined;
export declare function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter, refResolver?: RefResolver, options?: GetDefinitionOptions): (definition: Definition, baseType: BaseType) => Definition;
