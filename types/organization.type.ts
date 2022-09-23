import { Location } from "./location.type";

export interface OrganizationDetailsPayload {
    name: string;
    profileImageUrl: string;
    summary: string;
    description: string;
    assistanceTypes: string[];
    assistanceFrequency: string;
    peopleReached: string;
}

export interface ContactDetailsUpdatePayload {
    phoneNumbers: string[];
    email: string;
    website: string;
    facebook: string;
    instagram: string;
    twitter: string;
    paymentLink: string;
}

export interface BankDetailsUpdatePayload {
    bankName: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
    branchName: string;
    notes: string;
}

export interface Organization{
    id: number;
    name: string;
    summary?: string | null;
    description: string | null;
    profileImageUrl?: string | null;
    assistanceTypes?: string[] | null;
    assistanceFrequency?: string | null;
    peopleReached?: string | null;
    phoneNumbers?: string[] | null;
    email?: string | null;
    website?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    twitter?: string;
    paymentLink?: string;
    bankName?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
    accountType?: string | null;
    branchName?: string | null;
    notes?: string | null;
    locations?: Location[];
    approved: boolean;
    createdAt: Date;
    updatedAt: Date;
}