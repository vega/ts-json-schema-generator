"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionType = void 0;
const BaseType_1 = require("./BaseType");
const uniqueTypeArray_1 = require("../Utils/uniqueTypeArray");
const NeverType_1 = require("./NeverType");
const derefType_1 = require("../Utils/derefType");
class UnionType extends BaseType_1.BaseType {
    constructor(types) {
        super();
        this.discriminator = undefined;
        this.types = (0, uniqueTypeArray_1.uniqueTypeArray)(types.reduce((flatTypes, type) => {
            if (type instanceof UnionType) {
                flatTypes.push(...type.getTypes());
            }
            else if (!(type instanceof NeverType_1.NeverType)) {
                flatTypes.push(type);
            }
            return flatTypes;
        }, []));
    }
    setDiscriminator(discriminator) {
        this.discriminator = discriminator;
    }
    getDiscriminator() {
        return this.discriminator;
    }
    getId() {
        return `(${this.types.map((type) => type.getId()).join("|")})`;
    }
    getName() {
        return `(${this.types.map((type) => type.getName()).join("|")})`;
    }
    getTypes() {
        return this.types;
    }
    normalize() {
        if (this.types.length === 0) {
            return new NeverType_1.NeverType();
        }
        else if (this.types.length === 1) {
            return this.types[0];
        }
        else {
            const union = new UnionType(this.types.filter((type) => !((0, derefType_1.derefType)(type) instanceof NeverType_1.NeverType)));
            if (union.getTypes().length > 1) {
                return union;
            }
            else {
                return union.normalize();
            }
        }
    }
}
exports.UnionType = UnionType;
//# sourceMappingURL=UnionType.js.map