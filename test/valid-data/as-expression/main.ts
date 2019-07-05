const names = ["Joe", "Bob"] as const;
export type Names = (typeof names)[number];
