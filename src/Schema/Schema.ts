import { Map } from "../Utils/Map";
import { Definition } from "./Definition";

export interface Schema extends Definition {
    $schema: string;
    definitions: Map<Definition>;
}
