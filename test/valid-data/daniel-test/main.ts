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

export type ISysListSort = Record<keyof ISysListDb, SortDirection>; //ISysListSort is typealiasdeclaration with parameters [K, T]
                                                                    //Record<keyof ISysListDb, SortDirection> is of kind typeAliasDeclaration and has type of TypeReference
                                                                    //In TypeReferenceParser node has 2 arguments
// export type ISysListSort = {[P in keyof ISysListDb]: SortDirection};
// export type ISysListSort = Pick<ISysListDb, 'a'>

export interface sort_by {
    sort_by: ISysListSort;   //sort_by is of kind typereferencetype
}

export interface MyObject extends sort_by {} //Expressionwithtypeargument -> interface