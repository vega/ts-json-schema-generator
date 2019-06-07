export type Range<Min extends number, Max extends number> = number;

export interface MyObject {
    angle: Range<-180, 180>;
}
