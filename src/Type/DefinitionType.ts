import { BaseType } from "./BaseType";

export class DefinitionType extends BaseType {
    public constructor(
        private name: string | undefined,
        private type: BaseType,
        /**
         * Source Code fileName for DefinitionType. Used at TopRefNodeParser
         * and ExposeNodeParser. So that, You can override DefinitionFormatter
         * to custome your self DefinitionType name by fileName.
         */
        private sourceFileName?: string
    ) {
        super();
    }

    public getId(): string {
        return `def-${this.type.getId()}`;
    }

    public getName(): string {
        return this.name || super.getName();
    }

    public getType(): BaseType {
        return this.type;
    }

    public setSourceFileName(fileName: string) {
        this.sourceFileName = fileName;
    }

    public getSourceFileName() {
        return this.sourceFileName;
    }
}
