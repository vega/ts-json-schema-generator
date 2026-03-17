import type { Node } from "typescript";
import type { Context } from "../NodeParser.js";
export declare function hash(a: string | boolean | number | (string | boolean | number | Record<string, unknown>)[] | Record<string, unknown>): string | number;
export declare function getKey(node: Node, context: Context): string;
