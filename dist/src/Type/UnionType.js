"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionType = void 0;
const BaseType_js_1 = require("./BaseType.js");
const uniqueTypeArray_js_1 = require("../Utils/uniqueTypeArray.js");
const NeverType_js_1 = require("./NeverType.js");
const derefType_js_1 = require("../Utils/derefType.js");
class UnionType extends BaseType_js_1.BaseType {
    types;
    discriminator = undefined;
    constructor(types) {
        super();
        this.types = (0, uniqueTypeArray_js_1.uniqueTypeArray)(types.reduce((flatTypes, type) => {
            if (type instanceof UnionType) {
                flatTypes.push(...type.getTypes());
            }
            else if (!(type instanceof NeverType_js_1.NeverType)) {
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
            return new NeverType_js_1.NeverType();
        }
        else if (this.types.length === 1) {
            return this.types[0];
        }
        else {
            const union = new UnionType(this.types.filter((type) => !((0, derefType_js_1.derefType)(type) instanceof NeverType_js_1.NeverType)));
            if (union.getTypes().length > 1) {
                return union;
            }
            else {
                return union.normalize();
            }
        }
    }
    /**
     * Get the types in this union as a flat list.
     */
    getFlattenedTypes(deref = derefType_js_1.derefAliasedType) {
        return this.getTypes()
            .filter((t) => !(0, derefType_js_1.isHiddenType)(t))
            .map(deref)
            .flatMap((t) => {
            if (t instanceof UnionType) {
                return t.getFlattenedTypes(deref);
            }
            return t;
        });
    }
}
exports.UnionType = UnionType;
//# sourceMappingURL=UnionType.js.map