export enum RequestType {
    Ration = "Ration",
    Equipment = "Equipment",
}
export enum Unit {
    Kg = "Kg",
    L = "L",
    ML = "ML",
    Nos = "Nos",
}

export enum RequestStatus {
    Active = "Active",
    Completed = "Completed",
}

export interface Request{
    id: number;
    itemName: string;
    requestType: RequestType;
    placeId: string;
    unit: Unit;
    quantity: number;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestInput {
    itemName: string;
    requestType: RequestType;
    placeId: string | null;
    unit: Unit;
    quantity: number;
    status: RequestStatus;
}