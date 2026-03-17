import type { Definition } from "../Schema/Definition.js";
import type { StringMap } from "./StringMap.js";
export declare function removeUnreachable(rootTypeDefinition: Definition | undefined, definitions: StringMap<Definition>): StringMap<Definition>;
