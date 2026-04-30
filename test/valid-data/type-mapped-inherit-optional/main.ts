export interface TransitionOptions {
    transition?: string;
}

export interface Frontmatter extends TransitionOptions {
    layout?: string;
    title?: string;
}

export type TestOmit = Omit<Frontmatter, "title">;

export interface HeadmatterConfig extends TransitionOptions {
    author?: string;
}

export interface Headmatter extends HeadmatterConfig, Omit<Frontmatter, "title"> {
    defaults?: Frontmatter;
}
