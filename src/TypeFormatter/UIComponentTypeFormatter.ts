import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";
import { Definition } from "../Schema/Definition";
import { UIComponentType } from "../Type/UIComponentType";

export class UIComponentTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter) {}

    public supportsType(type: UIComponentType): boolean {
        return type instanceof UIComponentType;
    }
    public getDefinition(type: UIComponentType): Definition {
        const propsType = type.getPropsType();

        return {
            type: "UI.Component",
            props: propsType ? this.childTypeFormatter.getDefinition(propsType) : undefined,
        };
    }
    public getChildren(type: UIComponentType): BaseType[] {
        const propsType = type.getPropsType();

        const childrenOfReturnType = propsType ? this.childTypeFormatter.getChildren(propsType) : [];

        return uniqueArray(childrenOfReturnType);
    }
}
