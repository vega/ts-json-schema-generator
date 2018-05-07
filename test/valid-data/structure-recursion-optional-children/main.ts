/**
 * This description regulates how all ASTs should be stored when
 * written to disk or sent over the wire. It requires every
 * node to at least tell its name and some hint how a node can be
 * constructed at runtime.
 *
 * The data of a node is split up in two broader categories:
 * Children, which may be nested and properties, which should
 * not allow any nesting.
 */
export interface MyObject {
    /**
     * The name of this not, this is used to lookup the name of a
     * corresponding type.
     */
    name: string

    /**
     * This is effectively a namespace, allowing identical
     * names for nodes in different languages.
     */
    language: string

    /**
     * Nodes may have children in various categories. This base class
     * makes no assumptions about the names of children. Examples for
     * children in multiple categories would be things like "attributes"
     * and generic "children" in a specialization for XML.
     */
    children?: {
        [childrenCategory: string]: MyObject[];
    }

    /**
     * Nodes may have all kinds of properties that are specific to their
     * concrete use.
     */
    properties?: {
        [propertyName: string]: any;
    }
}
