export interface A {
  req: string;
  opt?: string;
  unpicked: string;
}

export type MyObject = Pick<A, "req" | "opt">;