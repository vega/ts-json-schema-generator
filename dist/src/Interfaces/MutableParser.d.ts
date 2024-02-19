import { SubNodeParser } from "./SubNodeParser";
export interface MutableParser {
    addNodeParser(parser: SubNodeParser): MutableParser;
}
