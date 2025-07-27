export interface FunctionDeclaration {
    kind: "function";
    name: string;
}

export interface VariableDeclaration {
    kind: "variable";
    name: string;
}

export interface MixinDeclaration {
    kind: "mixin";
    name: string;
}

export interface ClassDeclaration {
    kind: "class";
    name: string;
}

// These types don't have the discriminator field at all
export interface SimpleDeclaration {
    name: string;
}

export interface AnotherDeclaration {
    name: string;
    value: number;
}

/**
 * @discriminator kind
 */
export type Declaration = 
    | FunctionDeclaration 
    | VariableDeclaration 
    | MixinDeclaration 
    | ClassDeclaration 
    | SimpleDeclaration 
    | AnotherDeclaration;