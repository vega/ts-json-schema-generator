// Test exercising parameter-only infer pattern: method(param: infer U): any
// Expected: Schema should reflect inferred parameter type used by conditional Dtoify

type Dtoify<T> = T extends { fromDto(param: infer U): any } ? U : T;

class UserDto {
    name!: string;
    age!: number;
}

class Wrapper<T> {
    value!: T;
    fromDto(param: T): any {
        return param;
    }
}

export type GenericFromDtoParamInfer = Dtoify<Wrapper<UserDto>>;
