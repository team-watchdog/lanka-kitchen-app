export enum VolunteerRequestStatus {
    Active = "Active",
    Completed = "Completed",
}

export interface VolunteerRequest{
    id: number;
    title: string;
    description: string;
    placeId: string;
    skills: string[];
    status: VolunteerRequestStatus;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface VolunteerRequestInput {
    title: string;
    description: string;
    placeId: string | null;
    skills: string[];
    status: VolunteerRequestStatus;
}
