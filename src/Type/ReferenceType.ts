import { BaseType } from "./BaseType.js";

export class ReferenceType extends BaseType {
    private type: BaseType | null = null;

    private id: string | null = null;

    private name: string | null = null;

    public getId(): string {
        if (this.id == null) {
            throw new Error("Reference type ID not set yet");
        }
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getName(): string {
        if (this.name == null) {
            throw new Error("Reference type name not set yet");
        }
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getType(): BaseType {
        if (this.type == null) {
            throw new Error("Reference type not set yet");
        }
        return this.type;
    }

    public hasType(): boolean {
        return this.type != null;
    }

    public setType(type: BaseType): void {
        this.type = type;
        this.setId(type.getId());
        this.setName(type.getName());
    }
}
