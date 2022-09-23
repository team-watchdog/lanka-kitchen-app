export interface Location{
    placeId: string;
    geo: {
        lat: number;
        lon: number;
    }
    formattedAddress: string;
    district: string;
    province: string;
}
