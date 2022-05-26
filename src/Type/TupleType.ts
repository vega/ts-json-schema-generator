import { BaseType } from "./BaseType";
import { RestType } from "./RestType";

export class TupleType extends BaseType {
    private types: Readonly<Array<BaseType | undefined>>;

    public constructor(types: Array<BaseType | undefined>) {
        super();

        // console.log(`Tuple type length: ${types.length}`);
        // console.log(types)

        let resolved_types: Array<BaseType | undefined> = [];

        types.forEach((type) => {
            if (type instanceof RestType) {
                const inner_type = type.getType();
                if (inner_type instanceof TupleType) {
                    resolved_types = resolved_types.concat(inner_type.getTypes());
                } else {
                    resolved_types.push(type);
                }
            } else {
                resolved_types.push(type);
            }
        });

        // console.log("Resolved types")
        // console.log(resolved_types)

        this.types = resolved_types;
    }

    public getId(): string {
        return `[${this.types.map((item) => item?.getId() ?? "never").join(",")}]`;
    }

    public getTypes(): Readonly<Array<BaseType | undefined>> {
        return this.types;
    }
}
