/**
 * @private
 */
export type PrivateAlias = Date;

export interface ExposedSubType {
    privateAlias: PrivateAlias;
}

/**
 * @private
 */
export interface PrivateSubType {
    text: string;
    exposedSubType: ExposedSubType;
    privateAlias?: PrivateAlias;
}
