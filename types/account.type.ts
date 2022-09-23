export interface UserRoleDef{
    id: number;
    label: string;
    description: string;
    allowedActions: string[];
}

export interface Account{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    hashedPassword: string;
    verified: boolean;
    isActive: boolean;
    userRoles: number[];
    userRoleDefs: Partial<UserRoleDef>[];
    resetPasswordHash: string | null;
    resetPasswordHashExpiry: Date | null;
    confirmEmailHash: string | null;
    confirmEmailHashExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;

    permissions?: string[];
}