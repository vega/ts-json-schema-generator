interface RE {
    e: string;
}

interface RR {
    r: string;
}
type Leaf = {
    a?: string;
}

export type PlainNode = Leaf | PlainIntermediaryNode;
export type Node = PlainNode | (PlainNode & RE) | (PlainNode & RR);

export type PlainIntermediaryNode = Leaf & {
    children: Node[];
}

export type MyObject = {
    value: PlainNode;
}
