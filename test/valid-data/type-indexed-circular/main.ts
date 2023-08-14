export interface GeoJsonObject {
    type: GeometryCollection["type"];
}

export interface GeometryCollection extends GeoJsonObject {
    type: "GeometryCollection";
}

export type MyType = GeometryCollection;
