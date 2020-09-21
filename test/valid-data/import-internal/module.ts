/**
 * @internal
 */
export type InternalAlias = Date;

export interface ExposedSubType {
    internalAlias: InternalAlias;
}

/**
 * @internal
 */
export interface InternalSubType {
    text: string;
    exposedSubType: ExposedSubType;
    internalAlias?: InternalAlias;
}
