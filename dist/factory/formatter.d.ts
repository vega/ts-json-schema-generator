import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter";
import { Config } from "../src/Config";
import { MutableTypeFormatter } from "../src/MutableTypeFormatter";
import { TypeFormatter } from "../src/TypeFormatter";
export type FormatterAugmentor = (formatter: MutableTypeFormatter, circularReferenceTypeFormatter: CircularReferenceTypeFormatter) => void;
export declare function createFormatter(config: Config, augmentor?: FormatterAugmentor): TypeFormatter;
