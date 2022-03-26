function checkServerIdentity(hostname: string): Error | undefined {
    return undefined;
}
export interface Test {
    checkServerIdentity?: typeof checkServerIdentity | undefined;
    otherProp: string;
}
