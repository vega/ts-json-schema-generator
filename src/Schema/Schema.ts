import { Definition } from "./Definition";
import { Map } from "../Utils/Map";

export interface Schema extends Definition {
    $schema: string;
    definitions: Map<Definition>;
}
