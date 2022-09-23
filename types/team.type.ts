import { UserRoleDef } from "./account.type";

export interface TeamInvitation{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    created: boolean;
    userRoles: number[];
    userRoleDefs: Partial<UserRoleDef>[];
    createdAt: Date;
    updatedAt: Date;
}