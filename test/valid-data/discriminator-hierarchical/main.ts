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

export interface CustomElementMixinDeclaration {
    kind: "mixin";
    name: string;
    customElement: true;
}

export interface ClassDeclaration {
    kind: "class";
    name: string;
}

export interface CustomElementDeclaration {
    kind: "class";
    name: string;
    customElement: true;
}

/**
 * @discriminator kind
 */
export type Declaration = 
    | FunctionDeclaration 
    | VariableDeclaration 
    | MixinDeclaration 
    | CustomElementMixinDeclaration 
    | ClassDeclaration 
    | CustomElementDeclaration;