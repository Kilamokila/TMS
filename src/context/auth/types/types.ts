import type Keycloak from 'keycloak-js';

export type TKeycloakToken = string | null | undefined;

export interface IKeycloakContextProps {
    initialized: boolean;
    keycloak?: Keycloak;
    updateToken: () => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export interface IAuthUser {
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    name: string;
    preferred_username: string;
    sub: string;
    resource_access: ResourceAccess;
}

export type ResourceAccess = {
    TMS: {
        roles: UserRole[];
    };
};

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
