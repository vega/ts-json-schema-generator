export interface Container {
    child: Union;
}

export interface Dummy {
    x: number;
}

export interface Silly {
    y: number;
}

export type Union = Container | Silly;

export type Intersection = Union & Dummy;
