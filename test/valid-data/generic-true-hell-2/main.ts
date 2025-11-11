type DtoInternal<T> = T extends Date
    ? string
    : T extends { fromDto(param: infer U): any }
      ? U
      : {
            [K in keyof T]: Dto<T[K]>;
        };

export type Dto<T> = {
    [K in keyof T as DtoInternal<T[K]> extends never ? never : K]: DtoInternal<T[K]>;
};

export class ObjectWithDto {
    name!: string;
    fromDto(param: { hello: string }): void {}
}

export class ObjectWithDto2 {
    name!: string;
    fromDto(param: never): void {}
}

export interface OtherObject {
    date: Date;
    number: number;
    object: ObjectWithDto;
    object2: ObjectWithDto2;
}

export interface MyObject extends Dto<OtherObject> {}
