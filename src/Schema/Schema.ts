import { StringMap } from "../Utils/StringMap";
import { Definition } from "./Definition";

export interface Schema extends Definition {
    $schema: string;
    definitions: StringMap<Definition>;
}
