import { DefinitionType } from "../Type/DefinitionType";
import { BaseType } from "../Type/BaseType";

export const setSourceFileNameIfDefinitionType = (type: BaseType, sourceFileName: string) => {
    if (type instanceof DefinitionType) {
        type.setSourceFileName(sourceFileName);
    }
    return type;
};
