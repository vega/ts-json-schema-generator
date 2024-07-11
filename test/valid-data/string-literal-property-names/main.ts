// Class props has only implicit types!
export class MyClass {
    PROP_1 = '';
    "PROP_2" = '';
    "PROP.3" = '';
    "{PROP_4}" =  '';
    "400" = '';
    500 = '';
    '' = '';
    CHILD = {
        PROP_1: '',
        "PROP_2": '',
        "PROP.3": '',
        "{PROP_4}":  '',
        "400": '',
        500: '',
        '': '',
    };
}

export interface MyInterface {
    PROP_1: string;
    "PROP_2": string;
    "PROP.3": string;
    "{PROP_4}":  string;
    "400": string;
    500: string;
    '': string;
    CHILD : {
        PROP_1: string,
        "PROP_2": string,
        "PROP.3": string,
        "{PROP_4}":  string,
        "400": string,
        500: string,
        '': string
    };
}
