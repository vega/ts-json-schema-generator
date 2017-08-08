/// <reference types="mocha" />
export declare type Run = (expectation: string, callback?: ((this: Mocha.ITestCallbackContext, done: MochaDone) => any) | undefined) => Mocha.ITest;
