export interface GeoJSONPoint{
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    },
    properties: {
        [key: string]: unknown;
    }
}
