export interface ISysListDb {
    a: number;
    b: string;
    c: number;
}

export type SortDirection = 'ASC' | 'DESC';

export interface Blah {
    a: number;
    b:string;
    c: number;
    d: string;
}

export type ISysListSort = Record<keyof ISysListDb, SortDirection>;

export interface sort_by {
    sort_by: ISysListSort;
}

export interface MyObject extends sort_by {}