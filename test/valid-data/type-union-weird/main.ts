interface UnionElements {
    /**
     * Has a definition
     */
    stringWithDefinition: string;
    /**
     * Also has a definition
     */
    numberWithDefinition: number;
    stringWithoutDefinition: string;
    numberWithoutDefinition: number;
    /**
     * @minLength 10
     */
    stringWithMinLength: string;
    /**
     * @pattern ^\d+$
     */
    stringWithOnlyDigits: string;
    /**
     * @minimum 10
     */
    numberWithMinimum: number;
    /**
     * @maximum 5
     */
    numberWithMaximum: number;
    enumString: 'a' | 'b' | 'c';
    enumNumber: 1 | 2 | 3;
}

export interface WeirdUnion {
    noCollapse1?: UnionElements['stringWithDefinition'] | UnionElements['numberWithDefinition'];
    noCollapse2?: UnionElements['stringWithoutDefinition'] | UnionElements['enumNumber'];
    collapse1?: UnionElements['stringWithDefinition'] | UnionElements['numberWithoutDefinition'];
    collapse2?: UnionElements['stringWithoutDefinition'] | UnionElements['numberWithoutDefinition'];
    collapse3?: UnionElements['numberWithoutDefinition'] | UnionElements['enumNumber'];
    actuallyAnyString?: UnionElements['stringWithMinLength'] | UnionElements['stringWithoutDefinition'];
    actuallyAnyNumber?: UnionElements['numberWithMaximum'] | UnionElements['numberWithoutDefinition'];
    digitsOrLongString?: UnionElements['stringWithMinLength'] | UnionElements['stringWithOnlyDigits'];
    digitsOrNumber?: UnionElements['stringWithOnlyDigits'] | UnionElements['numberWithDefinition'];
    numberWithMinOrMax?: UnionElements['numberWithMinimum'] | UnionElements['numberWithMaximum'];
}

const validList = [
    {
        actuallyAnyString: 'short',
        actuallyAnyNumber: 1234,
        digitsOrLongString: '1234',
        digitsOrNumber: '1234',
        numberWithMinOrMax: 0,
    },
    {
        digitsOrLongString: 'veryverylong',
        digitsOrNumber: 1234,
        numberWithMinOrMax: 1234,
    },
] as const;
export const invalidList = [
    {
        digitsOrLongString: 'short',
    },
    {
        digitsOrNumber: 'word',
    },
    {
        numberWithMinOrMax: 7,
    }
] as const;

export type VALID = typeof validList[number];
export type INVALID = typeof invalidList[number];
