import { BaseType } from "./BaseType";

export class InferType extends BaseType {
    private type: BaseType | null;
    private id: string | null;
    private name: string | null;

    public getId(): string {
        if (this.id == null) {
            throw new Error("Infer type ID not set yet");
        }
        return this.id;
    }

    public setId(id: string) {
        this.id = id;
    }

    public getName(): string {
        if (this.name == null) {
            throw new Error("Infer type name not set yet.");
        }
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getType(): BaseType {
        if (this.type == null) {
            throw new Error("Infer type not set yet.");
        }
        return this.type;
    }

    public setType(type: BaseType): void {
        this.type = type;
        this.setId(type.getId());
        this.setName(type.getName());
    }
}
