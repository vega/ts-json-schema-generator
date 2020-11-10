import { SubTypeFormatter } from "./SubTypeFormatter";

export interface MutableTypeFormatter {
    addTypeFormatter(formatter: SubTypeFormatter): MutableTypeFormatter;
}
