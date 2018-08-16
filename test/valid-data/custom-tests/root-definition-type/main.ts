
export interface IInnerStuff {
    a: string;
}

export interface IExtensionStuff {
    b: IInnerStuff;
}

export interface IStuff extends IExtensionStuff {}