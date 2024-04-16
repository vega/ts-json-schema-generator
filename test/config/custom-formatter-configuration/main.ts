export interface ExportInterface {
    exportValue: string;
}
export type ExportAlias = ExportInterface;

interface PrivateInterface {
    privateValue: string;
}
type PrivateAlias = PrivateInterface;

interface MixedInterface {
    mixedValue: ExportAlias;
}
export type MixedAlias = PrivateInterface;

export type PublicAnonymousTypeLiteral = {
    publicValue: string;
};

type PrivateAnonymousTypeLiteral = {
    privateValue: string;
};

export interface MyObject {
    exportInterface: ExportInterface;
    exportAlias: ExportAlias;

    privateInterface: PrivateInterface;
    privateAlias: PrivateAlias;

    mixedInterface: MixedInterface;
    mixedAlias: MixedAlias;

    publicAnonymousTypeLiteral: PublicAnonymousTypeLiteral;
    privateAnonymousTypeLiteral: PrivateAnonymousTypeLiteral;

    exportedFunction: () => void;
}
