import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter.js";
import type { CompletedConfig } from "../src/Config.js";
import type { MutableTypeFormatter } from "../src/MutableTypeFormatter.js";
import type { TypeFormatter } from "../src/TypeFormatter.js";
export type FormatterAugmentor = (formatter: MutableTypeFormatter, circularReferenceTypeFormatter: CircularReferenceTypeFormatter) => void;
export declare function createFormatter(config: CompletedConfig, augmentor?: FormatterAugmentor): TypeFormatter;
