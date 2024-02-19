import { Node } from "typescript";
import { Context } from "../NodeParser";
export declare function hash(a: string | boolean | number | (string | boolean | number)[] | object): string | number;
export declare function getKey(node: Node, context: Context): string;
