export interface Container {
    children: Container[];
}

export type Dummy = {
    x: number;
};

export type Intersection = Container & Dummy;
