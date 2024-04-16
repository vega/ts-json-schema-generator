import { SubTypeFormatter } from "./SubTypeFormatter.js";

export interface MutableTypeFormatter {
    addTypeFormatter(formatter: SubTypeFormatter): MutableTypeFormatter;
}
