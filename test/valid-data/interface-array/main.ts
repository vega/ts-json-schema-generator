export type Tag = TagPrimitive | TagArray;
export type TagPrimitive = string | number | boolean | null;
export interface TagArray extends Array<Tag> {}
