import { Definition } from "../Schema/Definition";
import { StringMap } from "./StringMap";
export declare function removeUnreachable(rootTypeDefinition: Definition | undefined, definitions: StringMap<Definition>): StringMap<Definition>;
